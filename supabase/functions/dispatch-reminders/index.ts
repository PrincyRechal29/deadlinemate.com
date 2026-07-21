// ============================================================================
// dispatch-reminders — the core of DeadlineMate.
// Invoked every minute by pg_cron (with the shared CRON_SECRET as bearer).
// Claims due reminders atomically, delivers each via its channel, and records
// the outcome. Idempotent: only ever acts on rows it successfully claimed.
// ============================================================================
import { adminClient } from "../_shared/supabase.ts";
import { json } from "../_shared/cors.ts";
import { sendEmail, sendPush } from "../_shared/notify.ts";

const CRON_SECRET = Deno.env.get("CRON_SECRET");
const BATCH = 200;

Deno.serve(async (req) => {
  // Authorize: this is not user-facing. Require the shared cron secret.
  const auth = req.headers.get("Authorization") ?? "";
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return json({ error: "unauthorized" }, 401);
  }

  const admin = adminClient();

  // Recover anything stuck mid-send from a previous crashed run.
  await admin.rpc("dm_requeue_stuck_reminders");

  const { data: claimed, error } = await admin.rpc("dm_claim_due_reminders", { p_batch: BATCH });
  if (error) return json({ error: error.message }, 500);

  const rows = claimed ?? [];
  let sent = 0;
  let failed = 0;

  for (const r of rows) {
    try {
      if (r.channel === "email") {
        if (!r.email) throw new Error("no email on profile");
        await sendEmail({
          to: r.email,
          displayName: r.display_name,
          title: r.title,
          courseName: r.course_name,
          dueAtLocal: formatDue(r.due_at, r.timezone),
          offsetLabel: r.offset_label,
          assignmentId: r.assignment_id,
        });
      } else if (r.channel === "push") {
        await deliverPush(admin, r);
      } else if (r.channel === "sms") {
        // SMS (Twilio) is Pro-tier and not wired in this build; skip cleanly.
        await mark(admin, r, "skipped", "sms channel not enabled");
        continue;
      }
      await mark(admin, r, "sent");
      sent++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Retry (leave pending for the next tick) until we've tried 3 times.
      const exhausted = (r.attempts ?? 1) >= 3;
      await mark(admin, r, exhausted ? "failed" : "pending", msg);
      failed++;
      console.error(`reminder ${r.reminder_id} (${r.channel}) failed:`, msg);
    }
  }

  return json({ ok: true, claimed: rows.length, sent, failed });
});

async function deliverPush(admin: ReturnType<typeof adminClient>, r: Record<string, unknown>) {
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("endpoint, keys")
    .eq("user_id", r.user_id as string);
  if (!subs || subs.length === 0) throw new Error("no push subscriptions");

  const payload = {
    title: `Due soon: ${r.title}`,
    body: r.course_name ? `${r.course_name} — ${formatDue(r.due_at as string, r.timezone as string)}` : formatDue(r.due_at as string, r.timezone as string),
    url: `/app/assignments/${r.assignment_id}`,
  };

  let anyOk = false;
  for (const s of subs) {
    try {
      await sendPush(s as never, payload);
      anyOk = true;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      // 404/410 => subscription is dead; prune it.
      if (code === 404 || code === 410) {
        await admin.from("push_subscriptions").delete().eq("endpoint", (s as { endpoint: string }).endpoint);
      }
    }
  }
  if (!anyOk) throw new Error("all push endpoints failed");
}

async function mark(
  admin: ReturnType<typeof adminClient>,
  r: Record<string, unknown>,
  status: "sent" | "failed" | "skipped" | "pending",
  detail?: string,
) {
  await admin
    .from("reminders")
    .update({
      status,
      sent_at: status === "sent" ? new Date().toISOString() : null,
      last_error: detail ?? null,
    })
    .eq("id", r.reminder_id as string);

  // Only log terminal outcomes (a pending requeue isn't a delivery result).
  if (status === "sent" || status === "failed" || status === "skipped") {
    await admin.from("notification_log").insert({
      reminder_id: r.reminder_id,
      user_id: r.user_id,
      channel: r.channel,
      status: status === "sent" ? "sent" : "failed",
      detail: detail ?? null,
    });
  }
}

function formatDue(dueAtIso: string, timezone?: string | null): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone || "UTC",
    }).format(new Date(dueAtIso));
  } catch {
    return new Date(dueAtIso).toUTCString();
  }
}
