-- ============================================================================
-- DeadlineMate — Row Level Security.
-- The database is the security boundary. Every user-owned table denies by
-- default and only lets a row through when auth.uid() owns it. The service_role
-- key (used only in edge functions) bypasses RLS for trusted server work.
-- ============================================================================

-- ---- profiles --------------------------------------------------------------
alter table public.profiles enable row level security;
create policy "profiles: read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- inserts happen via the security-definer signup trigger, not the client.

-- ---- courses ---------------------------------------------------------------
alter table public.courses enable row level security;
create policy "courses: owner all" on public.courses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---- assignments -----------------------------------------------------------
alter table public.assignments enable row level security;
create policy "assignments: owner all" on public.assignments for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---- reminders -------------------------------------------------------------
-- Read-only to the owner; all writes go through the DB trigger / dispatcher.
alter table public.reminders enable row level security;
create policy "reminders: read own" on public.reminders for select
  using (auth.uid() = user_id);

-- ---- calendar_imports ------------------------------------------------------
alter table public.calendar_imports enable row level security;
create policy "imports: owner all" on public.calendar_imports for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---- push_subscriptions ----------------------------------------------------
alter table public.push_subscriptions enable row level security;
create policy "push: owner all" on public.push_subscriptions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---- subscriptions ---------------------------------------------------------
-- Read-only to the owner; only the Stripe webhook (service role) writes.
alter table public.subscriptions enable row level security;
create policy "subs: read own" on public.subscriptions for select
  using (auth.uid() = user_id);

-- ---- notification_log ------------------------------------------------------
alter table public.notification_log enable row level security;
create policy "notiflog: read own" on public.notification_log for select
  using (auth.uid() = user_id);

-- ============================================================================
-- Shared classes
-- ============================================================================

-- ---- shared_classes --------------------------------------------------------
alter table public.shared_classes enable row level security;
-- The owner, or any member, can read the class; only the owner writes it.
-- (owner_id is checked directly so the creator can read it back immediately on
-- INSERT ... RETURNING, before the enroll-owner trigger's row is observed.)
create policy "classes: member read" on public.shared_classes for select
  using (owner_id = auth.uid() or public.dm_is_class_member(id, auth.uid()));
create policy "classes: owner insert" on public.shared_classes for insert
  with check (auth.uid() = owner_id);
create policy "classes: owner update" on public.shared_classes for update
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "classes: owner delete" on public.shared_classes for delete
  using (auth.uid() = owner_id);

-- ---- shared_class_members --------------------------------------------------
alter table public.shared_class_members enable row level security;
-- You can see your own membership rows and (as owner) your class's roster.
create policy "members: self or owner read" on public.shared_class_members for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.shared_classes c where c.id = class_id and c.owner_id = auth.uid())
  );
-- Members are added via dm_join_class() (security definer). A member may
-- remove themselves; an owner may remove anyone.
create policy "members: leave" on public.shared_class_members for delete
  using (
    user_id = auth.uid()
    or exists (select 1 from public.shared_classes c where c.id = class_id and c.owner_id = auth.uid())
  );

-- ---- class_deadlines -------------------------------------------------------
alter table public.class_deadlines enable row level security;
-- Any member reads; owners and editors write.
create policy "class_deadlines: member read" on public.class_deadlines for select
  using (public.dm_is_class_member(class_id, auth.uid()));
create policy "class_deadlines: editor insert" on public.class_deadlines for insert
  with check (public.dm_class_role(class_id, auth.uid()) in ('owner','editor'));
create policy "class_deadlines: editor update" on public.class_deadlines for update
  using (public.dm_class_role(class_id, auth.uid()) in ('owner','editor'))
  with check (public.dm_class_role(class_id, auth.uid()) in ('owner','editor'));
create policy "class_deadlines: editor delete" on public.class_deadlines for delete
  using (public.dm_class_role(class_id, auth.uid()) in ('owner','editor'));
