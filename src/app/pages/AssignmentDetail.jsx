import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Check, Bell } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider.jsx';
import { useAssignment, useAssignmentMutations } from '../lib/api.js';
import { urgencyOf, URGENCY_TONE, URGENCY_LABEL } from '../lib/urgency.js';
import { fmtDue, relativeDue } from '../lib/dates.js';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import AssignmentForm from '../components/AssignmentForm.jsx';
import Spinner from '../components/Spinner.jsx';

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const tz = profile?.timezone;
  const { data: a, isLoading } = useAssignment(id);
  const { toggleDone, remove } = useAssignmentMutations();
  const [editing, setEditing] = React.useState(false);

  if (isLoading) return <div style={{ display: 'grid', placeItems: 'center', minHeight: 300 }}><Spinner /></div>;
  if (!a) return <div style={{ color: 'var(--ink-muted)' }}>Not found. <button onClick={() => navigate('/app')} style={linkBtn}>Back to dashboard</button></div>;

  const urg = urgencyOf(a);
  const done = a.status === 'done';
  const pending = (a.reminders || []).filter((r) => r.status === 'pending').sort((x, y) => new Date(x.remind_at) - new Date(y.remind_at));

  return (
    <>
      <button onClick={() => navigate(-1)} style={{ ...linkBtn, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <Badge tone={URGENCY_TONE[urg]} dot>{URGENCY_LABEL[urg]}</Badge>
            {a.course?.name && <Badge tone="neutral">{a.course.name}</Badge>}
            <Badge tone="neutral">{a.type}</Badge>
            {a.source !== 'manual' && <Badge tone="accent">{a.source === 'lms_import' ? 'Imported' : 'Shared'}</Badge>}
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', margin: '0 0 0.4rem', letterSpacing: '-0.03em', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }}>{a.title}</h1>
          <div style={{ color: done ? 'var(--ink-muted)' : 'var(--danger)', fontWeight: 550, fontSize: '0.95rem' }}>
            {fmtDue(a.due_at, tz)} · {relativeDue(a.due_at)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" iconLeft={<Pencil size={15} />} onClick={() => setEditing(true)}>Edit</Button>
          <Button variant={done ? 'secondary' : 'accent'} iconLeft={<Check size={16} />} onClick={() => toggleDone.mutate({ id: a.id, done: !done })}>
            {done ? 'Undo' : 'Mark done'}
          </Button>
        </div>
      </div>

      {a.notes && (
        <div style={{ marginTop: '1.6rem', padding: '1.1rem 1.3rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)', color: 'var(--ink-soft)', whiteSpace: 'pre-wrap', lineHeight: 1.55, fontSize: '0.95rem' }}>
          {a.notes}
        </div>
      )}

      <div style={{ marginTop: '1.8rem' }}>
        <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.8rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--ink-soft)' }}>
          <Bell size={16} /> Scheduled reminders
        </h3>
        {pending.length === 0 ? (
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>
            {done ? 'No reminders — this is done.' : 'No upcoming reminders. Adjust your reminder timing in Settings.'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pending.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0.95rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', background: 'var(--panel)', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--ink)' }}>{fmtDue(r.remind_at, tz)}</span>
                <Badge tone="accent" size="sm">{r.channel} · {r.offset_label || 'reminder'}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--line-soft)', paddingTop: '1.2rem' }}>
        <button onClick={() => { if (confirm('Delete this deadline permanently?')) { remove.mutate(a.id, { onSuccess: () => navigate('/app') }); } }}
          style={{ ...linkBtn, color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Trash2 size={15} /> Delete deadline
        </button>
      </div>

      <AssignmentForm open={editing} onClose={() => setEditing(false)} assignment={a} />
    </>
  );
}

const linkBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: '0.9rem', padding: 0 };
