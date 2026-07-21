// Channel senders: email (Resend) and Web Push (VAPID). No hard dependency on
// Resend beyond its REST API; web push uses the npm web-push library under
// Deno's node compat.
import webpush from "npm:web-push@3.6.7";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const EMAIL_FROM = Deno.env.get("EMAIL_FROM") ?? "DeadlineMate <reminders@deadlinemate.com>";
const APP_URL = Deno.env.get("APP_URL") ?? "https://deadlinemate.com";

const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY");
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY");
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@deadlinemate.com";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

export type ReminderEmail = {
  to: string;
  displayName?: string | null;
  title: string;
  courseName?: string | null;
  dueAtLocal: string; // preformatted for the recipient's timezone
  offsetLabel?: string | null;
  assignmentId: string;
};

export async function sendEmail(r: ReminderEmail): Promise<void> {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

  const link = `${APP_URL}/app/assignments/${r.assignmentId}`;
  const when = r.offsetLabel ? offsetPhrase(r.offsetLabel) : "soon";
  const subject = `⏰ Due ${when}: ${r.title}`;
  const html = emailTemplate({ ...r, link, when });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: EMAIL_FROM, to: r.to, subject, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}

export async function sendPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string; url: string },
): Promise<void> {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) throw new Error("VAPID keys not configured");
  await webpush.sendNotification(subscription as never, JSON.stringify(payload));
}

function offsetPhrase(label: string): string {
  const qty = label.replace(/[^0-9]/g, "");
  const unit = label.replace(/[0-9]/g, "");
  const map: Record<string, string> = { w: "week", d: "day", h: "hour", m: "minute" };
  const word = map[unit] ?? "";
  if (!qty || !word) return "soon";
  return `in ${qty} ${word}${qty === "1" ? "" : "s"}`;
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function emailTemplate(
  r: ReminderEmail & { link: string; when: string },
): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f7f9;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#20232a">
  <div style="max-width:480px;margin:0 auto;padding:32px 20px">
    <div style="background:#ffffff;border:1px solid rgba(9,15,20,.1);border-radius:16px;padding:28px 26px">
      <div style="font-size:13px;letter-spacing:.02em;color:#0a9cba;font-weight:600;text-transform:uppercase">DeadlineMate</div>
      <h1 style="font-size:22px;margin:14px 0 4px;letter-spacing:-.02em">Due ${esc(r.when)}</h1>
      <p style="margin:0 0 18px;color:#6d7177;font-size:15px">Hi ${esc(r.displayName ?? "there")}, a heads-up so nothing slips.</p>
      <div style="border:1px solid rgba(9,15,20,.1);border-radius:12px;padding:16px 18px;margin-bottom:22px">
        <div style="font-size:17px;font-weight:600">${esc(r.title)}</div>
        ${r.courseName ? `<div style="color:#6d7177;font-size:14px;margin-top:2px">${esc(r.courseName)}</div>` : ""}
        <div style="color:#e5484d;font-size:14px;margin-top:8px;font-weight:600">${esc(r.dueAtLocal)}</div>
      </div>
      <a href="${esc(r.link)}" style="display:inline-block;background:#0a9cba;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;font-size:15px">Open in DeadlineMate</a>
    </div>
    <p style="text-align:center;color:#9a9ea5;font-size:12px;margin-top:18px">
      You get these because you set a reminder. Manage them in <a href="${esc(APP_URL)}/app/settings" style="color:#6d7177">Settings</a>.
    </p>
  </div>
</body></html>`;
}
