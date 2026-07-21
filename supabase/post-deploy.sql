-- ============================================================================
-- Run this ONCE after `supabase db push`, in the Supabase SQL editor (or via
-- `supabase db execute`). It tells pg_cron how to reach your edge functions.
--
-- Replace the two values below:
--   • <PROJECT_REF>  — your project ref (e.g. abcd1234), from the dashboard URL.
--   • <CRON_SECRET>  — the SAME long random string you set as the CRON_SECRET
--                      edge-function secret (`supabase secrets set CRON_SECRET=...`).
-- ============================================================================

insert into private.dm_settings (key, value) values
  ('edge_base_url', 'https://<PROJECT_REF>.supabase.co/functions/v1'),
  ('cron_secret',   '<CRON_SECRET>')
on conflict (key) do update set value = excluded.value;

-- Sanity check: fire the dispatcher once by hand (should return an http request id).
-- select private.dm_dispatch_reminders();

-- Verify the schedule is registered:
-- select jobname, schedule, active from cron.job;
