// Safe fetch of a user-supplied calendar feed URL, with SSRF guards: https
// only, no private/loopback/link-local hosts, size cap, timeout. The import
// endpoint pulls arbitrary URLs, so this is a security boundary.

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const TIMEOUT_MS = 12000;

export async function fetchFeed(rawUrl: string): Promise<string> {
  let url: URL;
  try {
    url = new URL(rawUrl.trim().replace(/^webcal:\/\//i, "https://"));
  } catch {
    throw new Error("Invalid feed URL");
  }
  if (url.protocol !== "https:") throw new Error("Only https feed URLs are allowed");
  if (isBlockedHost(url.hostname)) throw new Error("That host is not allowed");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "DeadlineMate/1.0 (+https://deadlinemate.com)" },
    });
    if (!res.ok) throw new Error(`Feed responded ${res.status}`);

    const len = res.headers.get("content-length");
    if (len && +len > MAX_BYTES) throw new Error("Feed too large");

    const text = await res.text();
    if (text.length > MAX_BYTES) throw new Error("Feed too large");
    if (!text.includes("BEGIN:VCALENDAR")) throw new Error("Not a valid iCalendar feed");
    return text;
  } finally {
    clearTimeout(timer);
  }
}

function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".internal")) return true;
  // Literal IPv4 in a private / loopback / link-local range.
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;        // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }
  // IPv6 loopback / unique-local / link-local.
  if (h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
  return false;
}
