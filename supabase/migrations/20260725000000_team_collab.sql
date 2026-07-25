-- ============================================================================
-- DeadlineMate — Team collaboration: chat + calls (video / audio).
--
-- A shared_class IS the team. Its members (shared_class_members) can:
--   • chat in real time         → team_messages   (+ supabase_realtime)
--   • start / schedule calls     → calls            (video or audio)
--   • see who joined + history    → call_participants
--
-- Media transport is Daily.co (see supabase/functions/daily-room). This schema
-- owns the *lifecycle* — who called, who joined, when, peak headcount, history.
-- All writes go through SECURITY DEFINER RPCs so membership + state transitions
-- are enforced server-side; reads are gated by RLS reusing dm_is_class_member().
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Chat
-- ---------------------------------------------------------------------------
create table public.team_messages (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references public.shared_classes on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  body       text not null,
  created_at timestamptz not null default now(),
  constraint team_messages_body_len check (char_length(body) between 1 and 4000)
);
create index team_messages_class_idx on public.team_messages (class_id, created_at);

alter table public.team_messages enable row level security;

create policy "team_messages: member read" on public.team_messages
  for select using (public.dm_is_class_member(class_id, auth.uid()));

create policy "team_messages: member insert" on public.team_messages
  for insert with check (
    user_id = auth.uid() and public.dm_is_class_member(class_id, auth.uid())
  );

create policy "team_messages: author delete" on public.team_messages
  for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Calls (one row per instant/scheduled call)
-- ---------------------------------------------------------------------------
create table public.calls (
  id               uuid primary key default gen_random_uuid(),
  class_id         uuid not null references public.shared_classes on delete cascade,
  created_by       uuid references auth.users on delete set null,
  title            text,
  kind             text not null default 'video' check (kind in ('video','audio')),
  status           text not null default 'live'
                     check (status in ('scheduled','live','ended','cancelled')),
  room_name        text not null unique,          -- Daily room name
  scheduled_at     timestamptz,                    -- null for instant calls
  started_at       timestamptz,
  ended_at         timestamptz,
  peak_participants int not null default 0,        -- max concurrent joiners
  created_at       timestamptz not null default now()
);
create index calls_class_idx on public.calls (class_id, created_at desc);
create index calls_status_idx on public.calls (class_id, status);

alter table public.calls enable row level security;

-- Members can see their team's calls (upcoming, live, and history). Writes are
-- RPC-only (below), so there are deliberately no insert/update/delete policies.
create policy "calls: member read" on public.calls
  for select using (public.dm_is_class_member(class_id, auth.uid()));

-- ---------------------------------------------------------------------------
-- Call participants (who joined, when — drives headcount + history)
-- ---------------------------------------------------------------------------
create table public.call_participants (
  id        uuid primary key default gen_random_uuid(),
  call_id   uuid not null references public.calls on delete cascade,
  user_id   uuid not null references auth.users on delete cascade,
  joined_at timestamptz not null default now(),
  left_at   timestamptz
);
create index call_participants_call_idx on public.call_participants (call_id);
create index call_participants_user_idx on public.call_participants (user_id);
create index call_participants_open_idx on public.call_participants (call_id) where left_at is null;

alter table public.call_participants enable row level security;

create policy "call_participants: member read" on public.call_participants
  for select using (
    exists (
      select 1 from public.calls c
       where c.id = call_id and public.dm_is_class_member(c.class_id, auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

-- Team roster with profiles (names + avatars) for chat + members list.
create or replace function public.dm_team_members(p_class uuid)
returns table(user_id uuid, display_name text, avatar_url text, role text, joined_at timestamptz)
language sql
security definer
stable
set search_path = public
as $$
  select m.user_id, p.display_name, p.avatar_url, m.role, m.joined_at
    from public.shared_class_members m
    left join public.profiles p on p.id = m.user_id
   where m.class_id = p_class
     and public.dm_is_class_member(p_class, auth.uid())
   order by m.joined_at;
$$;

-- Generate a globally-unique, hard-to-guess Daily room name for a team.
create or replace function public.dm_new_room_name(p_class uuid)
returns text
language sql
volatile
as $$
  select 'dm-' || substr(replace(p_class::text, '-', ''), 1, 8)
              || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
$$;

-- Start an instant call. Returns the new call row.
create or replace function public.dm_start_call(
  p_class uuid, p_kind text default 'video', p_title text default null
)
returns public.calls
language plpgsql
security definer
set search_path = public
as $$
declare c public.calls;
begin
  if not public.dm_is_class_member(p_class, auth.uid()) then
    raise exception 'Not a team member' using errcode = 'insufficient_privilege';
  end if;
  if coalesce(p_kind, 'video') not in ('video', 'audio') then
    raise exception 'Invalid call kind %', p_kind;
  end if;
  insert into public.calls (class_id, created_by, title, kind, status, room_name, started_at)
  values (p_class, auth.uid(), nullif(trim(p_title), ''), coalesce(p_kind, 'video'),
          'live', public.dm_new_room_name(p_class), now())
  returning * into c;
  return c;
end;
$$;

-- Schedule a call for later.
create or replace function public.dm_schedule_call(
  p_class uuid, p_when timestamptz, p_kind text default 'video', p_title text default null
)
returns public.calls
language plpgsql
security definer
set search_path = public
as $$
declare c public.calls;
begin
  if not public.dm_is_class_member(p_class, auth.uid()) then
    raise exception 'Not a team member' using errcode = 'insufficient_privilege';
  end if;
  if p_when is null then raise exception 'A scheduled time is required'; end if;
  insert into public.calls (class_id, created_by, title, kind, status, room_name, scheduled_at)
  values (p_class, auth.uid(), nullif(trim(p_title), ''), coalesce(p_kind, 'video'),
          'scheduled', public.dm_new_room_name(p_class), p_when)
  returning * into c;
  return c;
end;
$$;

-- Join a call: records the participant, flips a scheduled call to live, and
-- bumps the peak headcount. Returns the (updated) call.
create or replace function public.dm_join_call(p_call uuid)
returns public.calls
language plpgsql
security definer
set search_path = public
as $$
declare c public.calls; open_cnt int;
begin
  select * into c from public.calls where id = p_call;
  if c.id is null then raise exception 'Call not found'; end if;
  if not public.dm_is_class_member(c.class_id, auth.uid()) then
    raise exception 'Not a team member' using errcode = 'insufficient_privilege';
  end if;
  if c.status in ('ended', 'cancelled') then
    raise exception 'This call has already ended';
  end if;

  if c.status = 'scheduled' then
    update public.calls set status = 'live', started_at = coalesce(started_at, now())
     where id = p_call;
  end if;

  -- Close any stale open session for this user, then open a fresh one.
  update public.call_participants set left_at = now()
   where call_id = p_call and user_id = auth.uid() and left_at is null;
  insert into public.call_participants (call_id, user_id) values (p_call, auth.uid());

  select count(*) into open_cnt
    from public.call_participants where call_id = p_call and left_at is null;
  update public.calls
     set peak_participants = greatest(peak_participants, open_cnt)
   where id = p_call
  returning * into c;
  return c;
end;
$$;

-- Leave a call. Auto-ends the call when the last participant leaves.
create or replace function public.dm_leave_call(p_call uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare cls uuid; open_cnt int;
begin
  select class_id into cls from public.calls where id = p_call;
  if cls is null then return; end if;
  if not public.dm_is_class_member(cls, auth.uid()) then
    raise exception 'Not a team member' using errcode = 'insufficient_privilege';
  end if;

  update public.call_participants set left_at = now()
   where call_id = p_call and user_id = auth.uid() and left_at is null;

  select count(*) into open_cnt
    from public.call_participants where call_id = p_call and left_at is null;
  if open_cnt = 0 then
    update public.calls set status = 'ended', ended_at = now()
     where id = p_call and status = 'live';
  end if;
end;
$$;

-- End a call now (host = creator, or the class owner). Closes open sessions.
create or replace function public.dm_end_call(p_call uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare c public.calls;
begin
  select * into c from public.calls where id = p_call;
  if c.id is null then return; end if;
  if c.created_by <> auth.uid()
     and public.dm_class_role(c.class_id, auth.uid()) <> 'owner' then
    raise exception 'Only the host or team owner can end this call'
      using errcode = 'insufficient_privilege';
  end if;
  update public.call_participants set left_at = now()
   where call_id = p_call and left_at is null;
  update public.calls
     set status = case when status = 'scheduled' then 'cancelled' else 'ended' end,
         ended_at = now()
   where id = p_call;
end;
$$;

grant execute on function public.dm_team_members(uuid)             to authenticated;
grant execute on function public.dm_start_call(uuid, text, text)   to authenticated;
grant execute on function public.dm_schedule_call(uuid, timestamptz, text, text) to authenticated;
grant execute on function public.dm_join_call(uuid)                to authenticated;
grant execute on function public.dm_leave_call(uuid)               to authenticated;
grant execute on function public.dm_end_call(uuid)                 to authenticated;

-- ---------------------------------------------------------------------------
-- Realtime — stream chat + call lifecycle to members' browsers.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.team_messages;
alter publication supabase_realtime add table public.calls;
alter publication supabase_realtime add table public.call_participants;
