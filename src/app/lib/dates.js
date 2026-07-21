// Date/time helpers. Everything is stored in UTC; we format for display in the
// user's timezone (from their profile).
import { formatInTimeZone } from 'date-fns-tz';
import { formatDistanceToNowStrict, isToday, isTomorrow, isPast, differenceInHours } from 'date-fns';

export function guessTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function fmtDue(iso, tz = guessTimezone()) {
  const d = new Date(iso);
  try {
    return formatInTimeZone(d, tz, "EEE d MMM, HH:mm");
  } catch {
    return d.toLocaleString();
  }
}

export function fmtDateOnly(iso, tz = guessTimezone()) {
  try {
    return formatInTimeZone(new Date(iso), tz, 'd MMM yyyy');
  } catch {
    return new Date(iso).toLocaleDateString();
  }
}

// Human relative label: "in 3 hours", "in 2 days", "5 hours ago".
export function relativeDue(iso) {
  const d = new Date(iso);
  if (isPast(d)) return `${formatDistanceToNowStrict(d)} ago`;
  if (isToday(d)) return `today · ${formatDistanceToNowStrict(d)}`;
  if (isTomorrow(d)) return 'tomorrow';
  return `in ${formatDistanceToNowStrict(d)}`;
}

export function hoursUntil(iso) {
  return differenceInHours(new Date(iso), new Date());
}

// Convert a datetime-local input value (in the user's tz) to a UTC ISO string.
export function localInputToUtc(value) {
  // <input type="datetime-local"> gives "YYYY-MM-DDTHH:mm" in local wall time.
  const d = new Date(value);
  return d.toISOString();
}

// Convert a UTC ISO string to a datetime-local input value in local wall time.
export function utcToLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
