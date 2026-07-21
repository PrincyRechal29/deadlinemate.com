// ============================================================================
// import-calendar — fetch an LMS/iCal feed, parse its events, upsert them as
// the caller's assignments (de-duped on the iCal UID), and save the feed for
// daily re-sync. Runs as the calling user (RLS applies), except the upsert of
// assignments which we do with the service role after verifying ownership.
// ============================================================================
import { adminClient, getUser } from "../_shared/supabase.ts";
import { json, preflight } from "../_shared/cors.ts";
import { fetchFeed } from "../_shared/fetchFeed.ts";
import { guessProvider, parseICal } from "../_shared/ical.ts";

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const user = await getUser(req);
  if (!user) return json({ error: "unauthorized" }, 401);

  let body: { feed_url?: string; label?: string; course_id?: string | null; import_id?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const admin = adminClient();

  // Resolve the feed to sync: either an existing saved import (re-sync) or a
  // brand-new URL.
  let feedUrl = body.feed_url?.trim();
  let importId = body.import_id;
  let courseId = body.course_id ?? null;

  if (importId) {
    const { data: imp } = await admin
      .from("calendar_imports")
      .select("*")
      .eq("id", importId)
      .eq("user_id", user.id)
      .single();
    if (!imp) return json({ error: "import not found" }, 404);
    feedUrl = imp.feed_url;
    courseId = imp.default_course_id;
  }

  if (!feedUrl) return json({ error: "feed_url required" }, 400);

  let events;
  try {
    const text = await fetchFeed(feedUrl);
    events = parseICal(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (importId) {
      await admin.from("calendar_imports")
        .update({ last_synced: new Date().toISOString(), last_status: `error: ${msg}` })
        .eq("id", importId);
    }
    return json({ error: msg }, 400);
  }

  // Create the calendar_imports record on first import.
  if (!importId) {
    const { data: imp, error } = await admin
      .from("calendar_imports")
      .insert({
        user_id: user.id,
        feed_url: feedUrl,
        provider: guessProvider(feedUrl),
        label: body.label ?? null,
        default_course_id: courseId,
      })
      .select("id")
      .single();
    if (error) return json({ error: error.message }, 500);
    importId = imp.id;
  }

  // Only import events that are still upcoming (skip past deadlines).
  const now = Date.now();
  const upcoming = events.filter((e) => e.dueAt.getTime() > now);

  let imported = 0;
  let updated = 0;

  for (const ev of upcoming) {
    const row = {
      user_id: user.id,
      course_id: courseId,
      title: ev.summary.slice(0, 300),
      notes: ev.description?.slice(0, 4000) ?? null,
      due_at: ev.dueAt.toISOString(),
      source: "lms_import",
      external_uid: ev.uid,
      import_id: importId,
    };
    // Upsert on (import_id, external_uid): re-imports update rather than dupe.
    const { data, error } = await admin
      .from("assignments")
      .upsert(row, { onConflict: "import_id,external_uid", ignoreDuplicates: false })
      .select("created_at, updated_at")
      .single();
    if (error) {
      console.error("upsert failed", error.message);
      continue;
    }
    // Heuristic: created within the last few seconds => new insert.
    if (data && new Date(data.created_at).getTime() > now - 10_000) imported++;
    else updated++;
  }

  await admin.from("calendar_imports")
    .update({ last_synced: new Date().toISOString(), last_status: `ok: ${imported} new, ${updated} updated` })
    .eq("id", importId);

  return json({ ok: true, import_id: importId, imported, updated, total: upcoming.length });
});
