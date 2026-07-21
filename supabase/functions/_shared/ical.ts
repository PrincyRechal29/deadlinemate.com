// Minimal, dependency-free iCalendar (RFC 5545) VEVENT parser. Handles line
// unfolding, escaped text, and the DTSTART/DUE forms LMS feeds emit
// (UTC "Z", floating local, and TZID=...). Good enough for Canvas/Moodle/
// Blackboard/Google Classroom exports without pulling a Node-only library.

export type ICalEvent = {
  uid: string;
  summary: string;
  description?: string;
  dueAt: Date;           // resolved to an absolute instant (UTC)
};

export function parseICal(text: string): ICalEvent[] {
  const lines = unfold(text);
  const events: ICalEvent[] = [];
  let cur: Record<string, { value: string; params: Record<string, string> }> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      cur = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (cur) {
        const ev = toEvent(cur);
        if (ev) events.push(ev);
      }
      cur = null;
      continue;
    }
    if (!cur) continue;

    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const left = line.slice(0, idx);
    const value = line.slice(idx + 1);
    const [name, ...paramParts] = left.split(";");
    const params: Record<string, string> = {};
    for (const p of paramParts) {
      const eq = p.indexOf("=");
      if (eq !== -1) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1);
    }
    cur[name.toUpperCase()] = { value, params };
  }
  return events;
}

function toEvent(
  fields: Record<string, { value: string; params: Record<string, string> }>,
): ICalEvent | null {
  // Prefer DUE (assignments), fall back to DTSTART (calendar events).
  const dueField = fields["DUE"] ?? fields["DTSTART"];
  if (!dueField) return null;
  const dueAt = parseDate(dueField.value, dueField.params);
  if (!dueAt || isNaN(dueAt.getTime())) return null;

  const uid = fields["UID"]?.value?.trim() || crypto.randomUUID();
  const summary = unescapeText(fields["SUMMARY"]?.value ?? "Untitled");
  const description = fields["DESCRIPTION"]?.value
    ? unescapeText(fields["DESCRIPTION"].value)
    : undefined;

  return { uid, summary, description, dueAt };
}

// Unfold folded lines (RFC 5545 §3.1: a leading space/tab continues the prior).
function unfold(text: string): string[] {
  const raw = text.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

function unescapeText(s: string): string {
  return s
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

// Parse an iCal date/date-time into an absolute instant.
function parseDate(value: string, params: Record<string, string>): Date | null {
  const v = value.trim();
  // Date-only (VALUE=DATE): 20260715 -> treat as end of that day, UTC.
  if (/^\d{8}$/.test(v)) {
    const y = +v.slice(0, 4), mo = +v.slice(4, 6), d = +v.slice(6, 8);
    return new Date(Date.UTC(y, mo - 1, d, 23, 59, 0));
  }
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  const parts = { y: +y, mo: +mo, d: +d, h: +h, mi: +mi, s: +s };

  if (z === "Z") {
    return new Date(Date.UTC(parts.y, parts.mo - 1, parts.d, parts.h, parts.mi, parts.s));
  }
  // TZID present, or floating local time. Resolve via the named zone if given.
  const tzid = params["TZID"];
  if (tzid) {
    return zonedToUtc(parts, tzid);
  }
  // Floating: interpret as UTC (best effort without a zone).
  return new Date(Date.UTC(parts.y, parts.mo - 1, parts.d, parts.h, parts.mi, parts.s));
}

// Convert a wall-clock time in a named IANA zone to an absolute UTC instant,
// using Intl to discover that zone's offset at the given moment.
function zonedToUtc(
  p: { y: number; mo: number; d: number; h: number; mi: number; s: number },
  tzid: string,
): Date {
  const asUtc = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s);
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tzid,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const parts = Object.fromEntries(
      dtf.formatToParts(new Date(asUtc)).map((x) => [x.type, x.value]),
    );
    const seen = Date.UTC(
      +parts.year, +parts.month - 1, +parts.day,
      +(parts.hour === "24" ? "0" : parts.hour), +parts.minute, +parts.second,
    );
    const offset = seen - asUtc;   // how far the zone is ahead of UTC at this time
    return new Date(asUtc - offset);
  } catch {
    return new Date(asUtc);        // unknown zone -> treat as UTC
  }
}

// Guess the LMS provider from a feed URL, for nicer labels.
export function guessProvider(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("instructure") || u.includes("canvas")) return "canvas";
  if (u.includes("moodle")) return "moodle";
  if (u.includes("blackboard")) return "blackboard";
  if (u.includes("google.com/calendar") || u.includes("calendar.google")) return "google";
  return "ics";
}
