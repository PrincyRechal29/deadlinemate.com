-- ============================================================================
-- DeadlineMate — core schema
-- All timestamps are stored in UTC. Per-user isolation is enforced by RLS
-- (see 20260701000100_rls.sql), never by the client.
-- ============================================================================

create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_net";         -- outbound http from the DB (cron -> edge fn)

-- ---------------------------------------------------------------------------
-- profiles — mirror of auth.users plus product-level settings.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                uuid primary key references auth.users on delete cascade,
  display_name      text,
  email             text,
  avatar_url        text,
  timezone          text not null default 'UTC',            -- IANA tz, drives "8am their time"
  plan              text not null default 'free'            -- 'free' | 'pro' | 'campus'
                      check (plan in ('free','pro','campus')),
  -- default reminder cadence applied to new assignments, e.g. ["1w","1d","3h"]
  reminder_offsets  text[] not null default array['1d','3h']::text[],
  -- channels to notify on, e.g. ["email"]; 'push'/'sms' gated to paid plans
  reminder_channels text[] not null default array['email']::text[],
  onboarded         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- courses (a.k.a. modules)
-- ---------------------------------------------------------------------------
create table public.courses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  name       text not null,
  color      text not null default '#0a9cba',
  code       text,                                          -- e.g. "CS101"
  archived   boolean not null default false,
  created_at timestamptz not null default now()
);
create index courses_user_idx on public.courses (user_id);

-- ---------------------------------------------------------------------------
-- assignments — the central object (assignments, exams, quizzes).
-- ---------------------------------------------------------------------------
create table public.assignments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  course_id     uuid references public.courses on delete set null,
  title         text not null,
  notes         text,
  due_at        timestamptz not null,                       -- UTC
  type          text not null default 'assignment'
                  check (type in ('assignment','exam','quiz','reading','project','other')),
  status        text not null default 'todo'
                  check (status in ('todo','in_progress','done')),
  priority      smallint check (priority between 1 and 5),
  source        text not null default 'manual'
                  check (source in ('manual','lms_import','shared')),
  external_uid  text,                                        -- iCal UID, for de-dupe on re-import
  import_id     uuid,                                        -- FK set in later migration
  shared_class_id uuid,                                      -- FK set in later migration
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index assignments_user_due_idx on public.assignments (user_id, due_at);
create index assignments_course_idx on public.assignments (course_id);
-- one imported event per feed cannot land twice
create unique index assignments_import_uid_uniq
  on public.assignments (import_id, external_uid)
  where import_id is not null and external_uid is not null;

-- ---------------------------------------------------------------------------
-- reminders — absolute UTC fire times generated from an assignment's offsets.
-- The dispatcher's hot path is (status, remind_at).
-- ---------------------------------------------------------------------------
create table public.reminders (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments on delete cascade,
  user_id       uuid not null references auth.users on delete cascade,
  remind_at     timestamptz not null,                       -- absolute UTC
  channel       text not null check (channel in ('email','push','sms')),
  offset_label  text,                                        -- '1w'|'1d'|'3h' for the UI
  status        text not null default 'pending'
                  check (status in ('pending','sent','failed','skipped')),
  attempts      smallint not null default 0,
  last_error    text,
  sent_at       timestamptz,
  created_at    timestamptz not null default now()
);
create index reminders_dispatch_idx on public.reminders (status, remind_at)
  where status = 'pending';
create index reminders_assignment_idx on public.reminders (assignment_id);

-- ---------------------------------------------------------------------------
-- calendar_imports — saved LMS / iCal feeds, re-synced daily.
-- ---------------------------------------------------------------------------
create table public.calendar_imports (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  feed_url      text not null,
  provider      text,                                        -- 'canvas'|'moodle'|'blackboard'|'google'|'ics'
  label         text,
  default_course_id uuid references public.courses on delete set null,
  last_synced   timestamptz,
  last_status   text,
  auto_sync     boolean not null default true,
  created_at    timestamptz not null default now()
);
create index calendar_imports_user_idx on public.calendar_imports (user_id);

alter table public.assignments
  add constraint assignments_import_fk
  foreign key (import_id) references public.calendar_imports on delete set null;

-- ---------------------------------------------------------------------------
-- push_subscriptions — Web Push (VAPID) endpoints, one per device.
-- ---------------------------------------------------------------------------
create table public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  endpoint   text not null,
  keys       jsonb not null,                                 -- { p256dh, auth }
  user_agent text,
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

-- ---------------------------------------------------------------------------
-- subscriptions — billing state mirrored from Stripe.
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users on delete cascade,
  provider            text not null default 'stripe',
  provider_customer   text,
  provider_sub        text unique,
  price_id            text,
  plan                text not null default 'pro',
  status              text not null,                          -- trialing|active|past_due|canceled|incomplete
  cancel_at_period_end boolean not null default false,
  current_period_end  timestamptz,
  trial_end           timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, provider)
);
create index subscriptions_user_idx on public.subscriptions (user_id);

-- ---------------------------------------------------------------------------
-- notification_log — audit trail of every send attempt (idempotency + support).
-- ---------------------------------------------------------------------------
create table public.notification_log (
  id          uuid primary key default gen_random_uuid(),
  reminder_id uuid references public.reminders on delete set null,
  user_id     uuid not null,
  channel     text not null,
  status      text not null,                                 -- 'sent'|'failed'
  detail      text,
  created_at  timestamptz not null default now()
);
create index notification_log_user_idx on public.notification_log (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at    before update on public.profiles      for each row execute function public.set_updated_at();
create trigger assignments_set_updated_at before update on public.assignments   for each row execute function public.set_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
