-- ============================================================================
-- DeadlineMate — atomic reminder claiming for the dispatcher.
-- Guarantees a reminder is handed to exactly one dispatcher run at a time, so
-- overlapping cron ticks can never double-send.
-- ============================================================================

-- Allow a transient 'sending' state between claim and delivery.
alter table public.reminders drop constraint if exists reminders_status_check;
alter table public.reminders add constraint reminders_status_check
  check (status in ('pending','sending','sent','failed','skipped'));

-- Claim a batch of due reminders: flip pending -> sending atomically (skipping
-- rows another run already locked) and return everything the dispatcher needs
-- to deliver them.
create or replace function public.dm_claim_due_reminders(p_batch int default 200)
returns table (
  reminder_id   uuid,
  assignment_id uuid,
  user_id       uuid,
  channel       text,
  offset_label  text,
  attempts      smallint,
  title         text,
  notes         text,
  due_at        timestamptz,
  course_name   text,
  email         text,
  display_name  text,
  timezone      text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with claimed as (
    update public.reminders r
       set status = 'sending', attempts = r.attempts + 1
     where r.id in (
       select id from public.reminders
        where status = 'pending' and remind_at <= now()
        order by remind_at
        limit p_batch
        for update skip locked
     )
    returning r.id, r.assignment_id, r.user_id, r.channel, r.offset_label, r.attempts
  )
  select c.id, c.assignment_id, c.user_id, c.channel, c.offset_label, c.attempts,
         a.title, a.notes, a.due_at, co.name,
         p.email, p.display_name, p.timezone
    from claimed c
    join public.assignments a on a.id = c.assignment_id
    left join public.courses co on co.id = a.course_id
    join public.profiles p on p.id = c.user_id;
end;
$$;

-- Recover reminders stuck 'sending' (e.g. a dispatcher crash) after 10 minutes.
create or replace function public.dm_requeue_stuck_reminders()
returns int
language sql
security definer
set search_path = public
as $$
  with x as (
    update public.reminders
       set status = 'pending'
     where status = 'sending'
       and created_at < now() - interval '10 minutes'
    returning 1
  )
  select count(*)::int from x;
$$;
