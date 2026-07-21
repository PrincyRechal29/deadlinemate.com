// ============================================================================
// sync-feeds — daily cron job. Re-polls every auto-sync calendar_imports feed
// and upserts new/changed deadlines. Invoked by pg_cron with the CRON_SECRET.
// ============================================================================
import { adminClient } from "../_shared/supabase.ts";
import { json } from "../_shared/cors.ts";
import { fetchFeed } from "../_shared/fetchFeed.ts";
import { parseICal } from "../_shared/ical.ts";

const CRON_SECRET = Deno.env.get("CRON_SECRET");

Deno.serve(async (req) => {
  const auth = req.headers.get("Authorization") ?? "";
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return json({ error: "unauthorized" }, 401);
  }

  const admin = adminClient();
  const { data: feeds } = await admin
    .from("calendar_imports")
    .select("*")
    .eq("auto_sync", true);

  let feedsSynced = 0;
  let totalUpserts = 0;

  for (const imp of feeds ?? []) {
    try {
      const text = await fetchFeed(imp.feed_url);
      const events = parseICal(text).filter((e) => e.dueAt.getTime() > Date.now());
      for (const ev of events) {
        await admin.from("assignments").upsert({
          user_id: imp.user_id,
          course_id: imp.default_course_id,
          title: ev.summary.slice(0, 300),
          notes: ev.description?.slice(0, 4000) ?? null,
          due_at: ev.dueAt.toISOString(),
          source: "lms_import",
          external_uid: ev.uid,
          import_id: imp.id,
        }, { onConflict: "import_id,external_uid", ignoreDuplicates: false });
        totalUpserts++;
      }
      await admin.from("calendar_imports")
        .update({ last_synced: new Date().toISOString(), last_status: `ok: ${events.length} events` })
        .eq("id", imp.id);
      feedsSynced++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await admin.from("calendar_imports")
        .update({ last_synced: new Date().toISOString(), last_status: `error: ${msg}` })
        .eq("id", imp.id);
    }
  }

  return json({ ok: true, feedsSynced, totalUpserts });
});
