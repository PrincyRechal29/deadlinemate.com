import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';
import { urgencyOf, URGENCY_TONE, URGENCY_LABEL } from '../lib/urgency.js';
import { fmtDue, relativeDue } from '../lib/dates.js';
import { useAssignmentMutations } from '../lib/api.js';

export default function DeadlineItem({ a, tz }) {
  const navigate = useNavigate();
  const { toggleDone } = useAssignmentMutations();
  const urg = urgencyOf(a);
  const done = a.status === 'done';
  const courseColor = a.course?.color || 'var(--line-strong)';

  return (
    <div
      onClick={() => navigate(`/app/assignments/${a.id}`)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.85rem 1rem',
        border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)',
        cursor: 'pointer', transition: 'border-color .16s', borderLeft: `3px solid ${courseColor}`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--line-strong)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
    >
      <button
        onClick={(e) => { e.stopPropagation(); toggleDone.mutate({ id: a.id, done: !done }); }}
        title={done ? 'Mark as to-do' : 'Mark done'}
        style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
          border: `2px solid ${done ? 'var(--urg-low)' : 'var(--line-strong)'}`,
          background: done ? 'var(--urg-low)' : 'transparent', display: 'grid', placeItems: 'center', padding: 0,
        }}
      >
        {done && <Check size={13} color="#fff" strokeWidth={3} />}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.95rem', fontWeight: 550, color: 'var(--ink)', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis', textDecoration: done ? 'line-through' : 'none',
          opacity: done ? 0.55 : 1,
        }}>{a.title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 2 }}>
          {a.course?.name ? `${a.course.name} · ` : ''}{fmtDue(a.due_at, tz)}
        </div>
      </div>

      {!done && <span style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>{relativeDue(a.due_at)}</span>}
      <Badge tone={URGENCY_TONE[urg]} dot size="sm">{URGENCY_LABEL[urg]}</Badge>
    </div>
  );
}
