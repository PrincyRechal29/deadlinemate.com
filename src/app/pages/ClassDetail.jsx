import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Copy, Check, CalendarPlus } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/AuthProvider.jsx';
import { useSharedClasses, useClassDeadlines, useClassMutations } from '../lib/api.js';
import { fmtDue } from '../lib/dates.js';
import { PageHeader, EmptyState, Field, fieldStyle } from '../components/ui.jsx';
import Modal from '../components/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import { localInputToUtc } from '../lib/dates.js';

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: classes = [] } = useSharedClasses();
  const cls = classes.find((c) => c.id === id);
  const { data: deadlines = [], isLoading } = useClassDeadlines(id);
  const { addDeadline, importDeadline } = useClassMutations();

  const [role, setRole] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', due: '', type: 'assignment', notes: '' });
  const [added, setAdded] = React.useState({});

  React.useEffect(() => {
    if (!id || !user) return;
    supabase.from('shared_class_members').select('role').eq('class_id', id).eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setRole(data?.role));
  }, [id, user]);

  const canEdit = role === 'owner' || role === 'editor';

  const submitDeadline = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.due) return;
    await addDeadline.mutateAsync({
      classId: id, title: form.title.trim(), due_at: localInputToUtc(form.due), type: form.type, notes: form.notes.trim() || null,
    });
    setAddOpen(false); setForm({ title: '', due: '', type: 'assignment', notes: '' });
  };

  const pull = async (d) => {
    await importDeadline.mutateAsync({ deadline: d, classId: id });
    setAdded((s) => ({ ...s, [d.id]: true }));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(cls?.join_code || '');
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  if (!cls) return <div style={{ color: 'var(--ink-muted)' }}>Loading class… <button onClick={() => navigate('/app/classes')} style={linkBtn}>Back</button></div>;

  return (
    <>
      <button onClick={() => navigate('/app/classes')} style={{ ...linkBtn, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> All classes
      </button>

      <PageHeader
        title={cls.name}
        subtitle={cls.term || 'Shared deadlines everyone in this class can see.'}
        action={canEdit && <Button variant="accent" iconLeft={<Plus size={17} />} onClick={() => setAddOpen(true)}>Add deadline</Button>}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.6rem', padding: '0.9rem 1.1rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--accent-soft)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Invite classmates with this code</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-deep)', letterSpacing: '0.06em' }}>{cls.join_code}</div>
        </div>
        <Button variant="secondary" iconLeft={copied ? <Check size={15} /> : <Copy size={15} />} onClick={copyCode}>{copied ? 'Copied' : 'Copy'}</Button>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--ink-muted)' }}>Loading…</div>
      ) : deadlines.length === 0 ? (
        <EmptyState icon={CalendarPlus} title="No shared deadlines yet"
          hint={canEdit ? 'Add the first deadline — everyone who joins will see it.' : 'The class owner hasn\'t added any deadlines yet.'} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {deadlines.map((d) => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.9rem 1.1rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 550, color: 'var(--ink)' }}>{d.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 2 }}>{fmtDue(d.due_at, profile?.timezone)}</div>
              </div>
              <Badge tone="neutral" size="sm">{d.type}</Badge>
              <Button variant={added[d.id] ? 'secondary' : 'accent'} size="sm" iconLeft={added[d.id] ? <Check size={14} /> : <CalendarPlus size={14} />}
                disabled={added[d.id]} onClick={() => pull(d)}>
                {added[d.id] ? 'Added' : 'Add to mine'}
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add a shared deadline">
        <form onSubmit={submitDeadline}>
          <Field label="Title"><input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Midterm exam" style={fieldStyle} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <Field label="Due"><input type="datetime-local" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} style={fieldStyle} /></Field>
            <Field label="Type">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={fieldStyle}>
                {['assignment', 'exam', 'quiz', 'reading', 'project', 'other'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notes (optional)"><textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...fieldStyle, resize: 'vertical' }} /></Field>
          <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button as="button" type="submit" variant="accent" disabled={addDeadline.isPending}>Add deadline</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

const linkBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: '0.9rem', padding: 0 };
