-- ============================================================================
-- DeadlineMate — shared class deadlines (organic, viral growth).
-- One student creates a class, shares a join code; classmates subscribe and
-- see the class's deadlines, and can pull any into their own list (which then
-- gets their personal reminders).
-- ============================================================================

create table public.shared_classes (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users on delete cascade,
  name       text not null,
  term       text,                                          -- e.g. "Fall 2026"
  color      text not null default '#0a9cba',
  -- short, human-shareable join code (e.g. "PHYS-7Q2K")
  join_code  text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  archived   boolean not null default false,
  created_at timestamptz not null default now()
);
create index shared_classes_owner_idx on public.shared_classes (owner_id);

create table public.shared_class_members (
  class_id  uuid not null references public.shared_classes on delete cascade,
  user_id   uuid not null references auth.users on delete cascade,
  role      text not null default 'member' check (role in ('owner','editor','member')),
  joined_at timestamptz not null default now(),
  primary key (class_id, user_id)
);
create index shared_class_members_user_idx on public.shared_class_members (user_id);

create table public.class_deadlines (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references public.shared_classes on delete cascade,
  created_by uuid not null references auth.users on delete set null,
  title      text not null,
  notes      text,
  due_at     timestamptz not null,
  type       text not null default 'assignment'
               check (type in ('assignment','exam','quiz','reading','project','other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index class_deadlines_class_idx on public.class_deadlines (class_id, due_at);

create trigger class_deadlines_set_updated_at
  before update on public.class_deadlines
  for each row execute function public.set_updated_at();

-- Wire assignments.shared_class_id (declared in init) to shared_classes so a
-- personal copy remembers its origin (and re-imports de-dupe).
alter table public.assignments
  add constraint assignments_shared_class_fk
  foreign key (shared_class_id) references public.shared_classes on delete set null;

-- Membership helper used by RLS to avoid recursive policy evaluation.
create or replace function public.dm_is_class_member(p_class uuid, p_user uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.shared_class_members
     where class_id = p_class and user_id = p_user
  );
$$;

create or replace function public.dm_class_role(p_class uuid, p_user uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.shared_class_members
   where class_id = p_class and user_id = p_user;
$$;

-- Join a class by its code; adds the caller as a member and returns the class id.
create or replace function public.dm_join_class(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  select id into cid from public.shared_classes
   where upper(join_code) = upper(trim(p_code)) and not archived;
  if cid is null then
    raise exception 'Class not found for code %', p_code using errcode = 'no_data_found';
  end if;
  insert into public.shared_class_members (class_id, user_id, role)
  values (cid, auth.uid(), 'member')
  on conflict (class_id, user_id) do nothing;
  return cid;
end;
$$;

-- When a class is created, enroll the owner as an 'owner' member.
create or replace function public.dm_on_class_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.shared_class_members (class_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict do nothing;
  return new;
end;
$$;

create trigger shared_classes_enroll_owner
  after insert on public.shared_classes
  for each row execute function public.dm_on_class_created();
