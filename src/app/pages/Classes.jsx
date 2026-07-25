import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Users, LogIn, ArrowRight } from 'lucide-react';
import { useSharedClasses, useClassMutations } from '../lib/api.js';
import { PageHeader, EmptyState, Field, fieldStyle } from '../components/ui.jsx';
import Modal from '../components/Modal.jsx';
import Button from '../../components/ui/Button.jsx';

export default function Classes() {
  const navigate = useNavigate();
  const { data: classes = [], isLoading } = useSharedClasses();
  const { createClass, joinClass } = useClassMutations();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [joinOpen, setJoinOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', term: '' });
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Invite links land here as /app/classes?join=CODE — open Join pre-filled.
  React.useEffect(() => {
    const invite = searchParams.get('join');
    if (invite) {
      setCode(invite);
      setError('');
      setJoinOpen(true);
      searchParams.delete('join');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doCreate = async (e) => {
    e.preventDefault(); setError('');
    if (!form.name.trim()) return setError('Name your class.');
    try {
      const c = await createClass.mutateAsync({ name: form.name.trim(), term: form.term.trim() || null, color: '#0a9cba' });
      setCreateOpen(false); setForm({ name: '', term: '' });
      navigate(`/app/classes/${c.id}`);
    } catch (err) { setError(err.message); }
  };

  const doJoin = async (e) => {
    e.preventDefault(); setError('');
    try {
      const cid = await joinClass.mutateAsync(code.trim());
      setJoinOpen(false); setCode('');
      navigate(`/app/classes/${cid}`);
    } catch (err) { setError('That code didn\'t match any class.'); }
  };

  return (
    <>
      <PageHeader
        title="Teams & shared classes"
        subtitle="Create a team for a class — shared deadlines, group chat, and video calls in one place."
        action={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" iconLeft={<LogIn size={16} />} onClick={() => { setError(''); setJoinOpen(true); }}>Join</Button>
            <Button variant="accent" iconLeft={<Plus size={17} />} onClick={() => { setError(''); setCreateOpen(true); }}>Create</Button>
          </div>
        }
      />

      {isLoading ? (
        <div style={{ color: 'var(--ink-muted)' }}>Loading…</div>
      ) : classes.length === 0 ? (
        <EmptyState icon={Users} title="No shared classes yet"
          hint="Create a class and share its join code, or join one a classmate set up."
          action={<Button variant="accent" iconLeft={<Plus size={16} />} onClick={() => setCreateOpen(true)}>Create a class</Button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.9rem' }}>
          {classes.map((c) => (
            <button key={c.id} onClick={() => navigate(`/app/classes/${c.id}`)} style={{
              textAlign: 'left', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)',
              padding: '1.2rem 1.3rem', cursor: 'pointer', borderTop: `3px solid ${c.color}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.name}</div>
                <ArrowRight size={16} style={{ color: 'var(--ink-faint)' }} />
              </div>
              {c.term && <div style={{ fontSize: '0.82rem', color: 'var(--ink-faint)', marginTop: 3 }}>{c.term}</div>}
              <div style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>Code: {c.join_code}</div>
            </button>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a shared class">
        <form onSubmit={doCreate}>
          <Field label="Class name"><input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Physics 201" style={fieldStyle} /></Field>
          <Field label="Term (optional)"><input value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} placeholder="Fall 2026" style={fieldStyle} /></Field>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button as="button" type="submit" variant="accent" disabled={createClass.isPending}>Create class</Button>
          </div>
        </form>
      </Modal>

      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Join a class">
        <form onSubmit={doJoin}>
          <Field label="Join code">
            <input autoFocus value={code} onChange={(e) => setCode(e.target.value)} placeholder="PHYS-7Q2K" style={{ ...fieldStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }} />
          </Field>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setJoinOpen(false)}>Cancel</Button>
            <Button as="button" type="submit" variant="accent" disabled={joinClass.isPending}>Join class</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
