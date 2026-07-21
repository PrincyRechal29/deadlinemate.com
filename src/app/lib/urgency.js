// Urgency scoring — the product's ranking language. Turns a due date + status
// into a tone the whole UI shares (critical/high/medium/low/done).
import { hoursUntil } from './dates.js';

export function urgencyOf(assignment) {
  if (assignment.status === 'done') return 'done';
  const h = hoursUntil(assignment.due_at);
  if (h < 0) return 'critical';       // overdue
  if (h <= 24) return 'critical';     // due within a day
  if (h <= 72) return 'high';         // within 3 days
  if (h <= 24 * 7) return 'medium';   // within a week
  return 'low';
}

export const URGENCY_LABEL = {
  critical: 'Due now',
  high: 'Soon',
  medium: 'This week',
  low: 'Upcoming',
  done: 'Done',
};

// Badge tone names understood by <Badge tone=…>.
export const URGENCY_TONE = {
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
  done: 'success',
};

// A sortable weight so overdue/critical float to the top.
export function urgencyRank(a) {
  const order = { critical: 0, high: 1, medium: 2, low: 3, done: 4 };
  return order[urgencyOf(a)] ?? 5;
}

export function sortByUrgency(list) {
  return [...list].sort((a, b) => {
    const ra = urgencyRank(a), rb = urgencyRank(b);
    if (ra !== rb) return ra - rb;
    return new Date(a.due_at) - new Date(b.due_at);
  });
}
