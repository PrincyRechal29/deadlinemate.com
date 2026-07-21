-- ============================================================================
-- DeadlineMate — scheduled jobs.
-- pg_cron ticks the reminder dispatcher every minute and the feed re-sync
-- daily, by calling the corresponding edge functions over HTTP (pg_net).
--
-- The function base URL and a shared cron secret are NOT hard-coded here — they
-- differ per project and the secret must not live in migrations. They are read
-- from private.dm_settings, which the deploy step populates (see
-- scripts/post-deploy.sql / DEPLOYMENT.md).
-- ============================================================================

create extension if not exists "pg_cron";

create schema if not exists private;

create table if not exists private.dm_settings (
  key   text primary key,
  value text not null
);

-- Fire an edge function by name with the shared cron secret as bearer.
create or replace function private.dm_invoke_function(fn text, body jsonb default '{}'::jsonb)
returns bigint
language plpgsql
security definer
set search_path = private, public
as $$
declare
  base   text;
  secret text;
  req_id bigint;
begin
  select value into base   from private.dm_settings where key = 'edge_base_url';
  select value into secret from private.dm_settings where key = 'cron_secret';
  if base is null then
    raise notice 'dm_settings.edge_base_url not set; skipping %', fn;
    return null;
  end if;

  select net.http_post(
    url     := base || '/' || fn,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(secret, '')
    ),
    body    := body,
    timeout_milliseconds := 30000
  ) into req_id;
  return req_id;
end;
$$;

-- Convenience wrappers so cron job commands stay readable.
create or replace function private.dm_dispatch_reminders() returns void
language sql security definer set search_path = private, public as $$
  select private.dm_invoke_function('dispatch-reminders');
$$;

create or replace function private.dm_sync_feeds() returns void
language sql security definer set search_path = private, public as $$
  select private.dm_invoke_function('sync-feeds');
$$;

-- Schedule (idempotent: unschedule an existing job of the same name first).
do $$
begin
  if exists (select 1 from cron.job where jobname = 'dm-dispatch-reminders') then
    perform cron.unschedule('dm-dispatch-reminders');
  end if;
  if exists (select 1 from cron.job where jobname = 'dm-sync-feeds') then
    perform cron.unschedule('dm-sync-feeds');
  end if;
exception when others then
  -- cron.job not queryable in some local setups; ignore.
  null;
end $$;

select cron.schedule('dm-dispatch-reminders', '* * * * *',  'select private.dm_dispatch_reminders();');
select cron.schedule('dm-sync-feeds',         '0 6 * * *',   'select private.dm_sync_feeds();');
