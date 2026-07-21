import React from 'react';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { useCourses, useCourseMutations, useAssignments } from '../lib/api.js';
import { PageHeader, EmptyState, Field, fieldStyle } from '../components/ui.jsx';
import Modal from '../components/Modal.jsx';
import Button from '../../components/ui/Button.jsx';

const PALETTE = ['#0a9cba', '#e5484d', '#dc9a00', '#30a46c', '#8b5cf6', '#ec4899', '#f97316', '#3b82f6'];

export default function Courses() {
  const { data: courses = [], isLoading } = useCourses();
  const { data: assignments = [] } = useAssignments();
  const { create, remove } = useCourseMutations();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', code: '', color: PALETTE[0] });
  const [error, setError] = React.useState('');

  const countFor = (id) => assignments.filter((a) => a.course_id === id && a.status !== 'done').length;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name your course.');
    try {
      await create.mutateAsync({ name: form.name.trim(), code: form.code.trim() || null, color: form.color });
      setOpen(false); setForm({ name: '', code: '', color: PALETTE[0] }); setError('');
    } catch (err) { setError(err.message); }
  };

  return (
    <>
      <PageHeader
        title="Courses"
        subtitle="Group deadlines by module so your dashboard stays readable."
        action={<Button variant="accent" iconLeft={<Plus size={17} />} onClick={() => setOpen(true)}>New course</Button>}
      />

      {isLoading ? (
        <div style={{ color: 'var(--ink-muted)' }}>Loading…</div>
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses yet" hint="Create a course like “CS101” and colour-code its deadlines."
          action={<Button variant="accent" iconLeft={<Plus size={16} />} onClick={() => setOpen(true)}>Add a course</Button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.9rem' }}>
          {courses.map((c) => (
            <div key={c.id} style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)', padding: '1.1rem 1.2rem', borderTop: `3px solid ${c.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.name}</div>
                  {c.code && <div style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', marginTop: 2 }}>{c.code}</div>}
                </div>
                <button onClick={() => { if (confirm(`Delete “${c.name}”? Its deadlines will be kept but un-grouped.`)) remove.mutate(c.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)' }}><Trash2 size={16} /></button>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', marginTop: '0.9rem' }}>{countFor(c.id)} active deadline{countFor(c.id) === 1 ? '' : 's'}</div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New course">
        <form onSubmit={submit}>
          <Field label="Course name"><input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Introduction to Psychology" style={fieldStyle} /></Field>
          <Field label="Code (optional)"><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="PSY101" style={fieldStyle} /></Field>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.82rem', fontWeight: 550, color: 'var(--ink-soft)' }}>Colour</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
            {PALETTE.map((col) => (
              <button key={col} type="button" onClick={() => setForm({ ...form, color: col })} style={{
                width: 28, height: 28, borderRadius: '50%', background: col, cursor: 'pointer',
                border: form.color === col ? '2px solid var(--ink)' : '2px solid transparent', outline: form.color === col ? '2px solid var(--panel)' : 'none',
              }} />
            ))}
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button as="button" type="submit" variant="accent" disabled={create.isPending}>{create.isPending ? 'Saving…' : 'Create course'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
