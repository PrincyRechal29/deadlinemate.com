import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider.jsx';
import { useAssignments } from '../lib/api.js';
import { urgencyOf } from '../lib/urgency.js';
import { PageHeader } from '../components/ui.jsx';
import DeadlineItem from '../components/DeadlineItem.jsx';
import AssignmentForm from '../components/AssignmentForm.jsx';
import Button from '../../components/ui/Button.jsx';

const URG_COLOR = {
  critical: 'var(--urg-critical)', high: 'var(--urg-high)',
  medium: 'var(--urg-medium)', low: 'var(--urg-low)', done: 'var(--ink-faint)',
};

export default function CalendarPage() {
  const { profile } = useAuth();
  const tz = profile?.timezone;
  const { data: all = [] } = useAssignments();
  const [cursor, setCursor] = React.useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selected, setSelected] = React.useState(null);   // yyyy-mm-dd
  const [showForm, setShowForm] = React.useState(false);

  const byDay = React.useMemo(() => {
    const map = {};
    for (const a of all) {
      const key = dayKey(new Date(a.due_at));
      (map[key] ||= []).push(a);
    }
    return map;
  }, [all]);

  const grid = React.useMemo(() => buildGrid(cursor), [cursor]);
  const monthLabel = cursor.toLocaleString('default', { month: 'long', year: 'numeric' });
  const selectedList = selected ? (byDay[selected] || []) : [];

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="See your workload spread across the month."
        action={<Button variant="accent" iconLeft={<Plus size={17} />} onClick={() => setShowForm(true)}>New deadline</Button>}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <button onClick={() => setCursor(shiftMonth(cursor, -1))} style={navBtn}><ChevronLeft size={18} /></button>
        <div style={{ fontWeight: 600, fontSize: '1.05rem', minWidth: 170, textAlign: 'center' }}>{monthLabel}</div>
        <button onClick={() => setCursor(shiftMonth(cursor, 1))} style={navBtn}><ChevronRight size={18} /></button>
        <button onClick={() => { const d = new Date(); d.setDate(1); setCursor(d); }} style={{ ...navBtn, width: 'auto', padding: '0 0.8rem', fontSize: '0.83rem' }}>Today</button>
      </div>

      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--panel)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--line)' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} style={{ padding: '0.55rem', textAlign: 'center', fontSize: '0.74rem', fontWeight: 600, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {grid.map((cell, i) => {
            const key = dayKey(cell.date);
            const items = byDay[key] || [];
            const isToday = key === dayKey(new Date());
            return (
              <button key={i} onClick={() => setSelected(key)} style={{
                minHeight: 82, textAlign: 'left', padding: '0.4rem 0.45rem', cursor: 'pointer',
                border: 'none', borderRight: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)',
                background: selected === key ? 'var(--accent-soft)' : cell.inMonth ? 'var(--panel)' : 'var(--page-2)',
                opacity: cell.inMonth ? 1 : 0.55,
              }}>
                <div style={{
                  fontSize: '0.8rem', fontWeight: isToday ? 700 : 500,
                  color: isToday ? '#fff' : 'var(--ink-soft)',
                  background: isToday ? 'var(--accent)' : 'transparent',
                  width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', marginBottom: 4,
                }}>{cell.date.getDate()}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {items.slice(0, 4).map((a) => (
                    <span key={a.id} title={a.title} style={{ width: 7, height: 7, borderRadius: '50%', background: URG_COLOR[urgencyOf(a)] }} />
                  ))}
                  {items.length > 4 && <span style={{ fontSize: '0.66rem', color: 'var(--ink-faint)' }}>+{items.length - 4}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', margin: '0 0 0.8rem' }}>
            {new Date(selected).toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          {selectedList.length === 0 ? (
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Nothing due this day.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedList.map((a) => <DeadlineItem key={a.id} a={a} tz={tz} />)}
            </div>
          )}
        </div>
      )}

      <AssignmentForm open={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}

const navBtn = { width: 38, height: 38, borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', background: 'var(--panel)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--ink)' };

function dayKey(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function shiftMonth(d, delta) { const n = new Date(d); n.setMonth(n.getMonth() + delta); return n; }
function buildGrid(cursor) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startDow = (first.getDay() + 6) % 7; // Monday-first
  const start = new Date(first);
  start.setDate(first.getDate() - startDow);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    cells.push({ date, inMonth: date.getMonth() === cursor.getMonth() });
  }
  return cells;
}
