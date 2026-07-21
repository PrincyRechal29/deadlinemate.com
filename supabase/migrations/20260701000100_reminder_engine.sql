-- ============================================================================
-- DeadlineMate — reminder engine (server-side, authoritative).
--
-- When an assignment's due date changes (or it is created), we regenerate its
-- *future pending* reminders from the owner's chosen offsets and channels.
-- Reminders already sent, or whose fire time is in the past, are left alone so
-- we never double-send and never resurrect a missed reminder.
-- ============================================================================

-- Map a compact offset label ("1w","2d","3h","30m") to a Postgres interval.
create or replace function public.dm_offset_to_interval(label text)
returns interval
language plpgsql
immutable
as $$
declare
  qty  int;
  unit text;
begin
  if label is null then
    return null;
  end if;
  qty  := nullif(regexp_replace(label, '[^0-9]', '', 'g'), '')::int;
  unit := lower(regexp_replace(label, '[0-9]', '', 'g'));
  if qty is null then
    return null;
  end if;
  return case unit
    when 'w' then make_interval(weeks  => qty)
    when 'd' then make_interval(days   => qty)
    when 'h' then make_interval(hours  => qty)
    when 'm' then make_interval(mins   => qty)
    else null
  end;
end;
$$;

-- Regenerate the reminder rows for a single assignment.
create or replace function public.dm_regenerate_reminders(p_assignment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  a         record;
  prof      record;
  off_label text;
  chan      text;
  fire_at   timestamptz;
begin
  select * into a from public.assignments where id = p_assignment_id;
  if not found then
    return;
  end if;

  select reminder_offsets, reminder_channels
    into prof
    from public.profiles
   where id = a.user_id;

  -- Clear future, not-yet-sent reminders; keep history of sent/failed ones.
  delete from public.reminders
   where assignment_id = a.id
     and status = 'pending';

  -- Nothing to schedule for completed work.
  if a.status = 'done' then
    return;
  end if;

  foreach off_label in array coalesce(prof.reminder_offsets, array['1d']::text[]) loop
    fire_at := a.due_at - public.dm_offset_to_interval(off_label);
    if fire_at is null or fire_at <= now() then
      continue;                                   -- skip offsets already in the past
    end if;
    foreach chan in array coalesce(prof.reminder_channels, array['email']::text[]) loop
      insert into public.reminders (assignment_id, user_id, remind_at, channel, offset_label)
      values (a.id, a.user_id, fire_at, chan, off_label);
    end loop;
  end loop;
end;
$$;

-- Trigger: (re)generate reminders after an assignment is inserted or its due
-- date / status changes.
create or replace function public.dm_on_assignment_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT'
     or new.due_at is distinct from old.due_at
     or new.status is distinct from old.status then
    perform public.dm_regenerate_reminders(new.id);
  end if;
  return new;
end;
$$;

create trigger assignments_generate_reminders
  after insert or update on public.assignments
  for each row execute function public.dm_on_assignment_change();

-- ---------------------------------------------------------------------------
-- Profile provisioning: create a profiles row the moment a user signs up.
-- ---------------------------------------------------------------------------
create or replace function public.dm_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.dm_handle_new_user();
