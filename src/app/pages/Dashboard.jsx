import React from 'react';
import { Plus, CalendarClock, CheckCircle2, Flame } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider.jsx';
import { useAssignments } from '../lib/api.js';
import { sortByUrgency, urgencyOf } from '../lib/urgency.js';
import { hoursUntil } from '../lib/dates.js';
import { PageHeader, EmptyState } from '../components/ui.jsx';
import DeadlineItem from '../components/DeadlineItem.jsx';
import AssignmentForm from '../components/AssignmentForm.jsx';
import Button from '../../components/ui/Button.jsx';

const FILTERS = [
  { key: 'active', label: 'Active' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'done', label: 'Done' },
  { key: 'all', label: 'All' },
];

export default function Dashboard() {
  const { profile } = useAuth();
  const tz = profile?.timezone;
  const { data: all = [], isLoading } = useAssignments();
  const [filter, setFilter] = React.useState('active');
  const [showForm, setShowForm] = React.useState(false);

  const filtered = React.useMemo(() => {
    let list = all;
    if (filter === 'active') list = all.filter((a) => a.status !== 'done');
    else if (filter === 'done') list = all.filter((a) => a.status === 'done');
    else if (filter === 'today') list = all.filter((a) => a.status !== 'done' && hoursUntil(a.due_at) <= 24);
    else if (filter === 'week') list = all.filter((a) => a.status !== 'done' && hoursUntil(a.due_at) <= 24 * 7);
    return sortByUrgency(list);
  }, [all, filter]);

  const stats = React.useMemo(() => {
    const active = all.filter((a) => a.status !== 'done');
    const overdue = active.filter((a) => hoursUntil(a.due_at) < 0).length;
    const dueToday = active.filter((a) => { const h = hoursUntil(a.due_at); return h >= 0 && h <= 24; }).length;
    const doneCount = all.filter((a) => a.status === 'done').length;
    return { active: active.length, overdue, dueToday, doneCount };
  }, [all]);

  return (
    <>
      <PageHeader
        title={`Hi ${profile?.display_name || 'there'} 👋`}
        subtitle="Everything you owe, ranked by how soon it's due."
        action={<Button variant="accent" iconLeft={<Plus size={17} />} onClick={() => setShowForm(true)}>New deadline</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.9rem', marginBottom: '1.8rem' }}>
        <Stat icon={CalendarClock} tone="var(--accent)" label="Active" value={stats.active} />
        <Stat icon={Flame} tone="var(--urg-critical)" label="Overdue" value={stats.overdue} />
        <Stat icon={CalendarClock} tone="var(--urg-high)" label="Due today" value={stats.dueToday} />
        <Stat icon={CheckCircle2} tone="var(--urg-low)" label="Completed" value={stats.doneCount} />
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '0.42rem 0.85rem', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500,
            border: '1px solid ' + (filter === f.key ? 'var(--ink)' : 'var(--line)'),
            background: filter === f.key ? 'var(--ink)' : 'var(--panel)', color: filter === f.key ? '#fff' : 'var(--ink-muted)',
          }}>{f.label}</button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--ink-muted)', padding: '2rem 0' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title={filter === 'done' ? 'Nothing completed yet' : "You're all clear"}
          hint={filter === 'done' ? 'Completed deadlines will show up here.' : 'Add your first deadline and we\'ll remind you before it\'s due.'}
          action={filter !== 'done' && <Button variant="accent" iconLeft={<Plus size={16} />} onClick={() => setShowForm(true)}>Add a deadline</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map((a) => <DeadlineItem key={a.id} a={a} tz={tz} />)}
        </div>
      )}

      <AssignmentForm open={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}

function Stat({ icon: Icon, tone, label, value }) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)', padding: '1rem 1.1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ink-muted)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        <Icon size={16} style={{ color: tone }} /> {label}
      </div>
      <div style={{ fontSize: '1.7rem', fontWeight: 650, color: 'var(--ink)', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>{value}</div>
    </div>
  );
}
