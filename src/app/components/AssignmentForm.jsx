import React from 'react';
import Modal from './Modal.jsx';
import { Field, fieldStyle } from './ui.jsx';
import Button from '../../components/ui/Button.jsx';
import { useCourses, useAssignmentMutations } from '../lib/api.js';
import { utcToLocalInput, localInputToUtc } from '../lib/dates.js';

const TYPES = ['assignment', 'exam', 'quiz', 'reading', 'project', 'other'];

// Create or edit an assignment. Pass `assignment` to edit, or omit to create.
export default function AssignmentForm({ open, onClose, assignment, defaultCourseId }) {
  const { data: courses = [] } = useCourses();
  const { create, update } = useAssignmentMutations();
  const editing = !!assignment;

  const [form, setForm] = React.useState(() => initial(assignment, defaultCourseId));
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (open) { setForm(initial(assignment, defaultCourseId)); setError(''); }
  }, [open, assignment, defaultCourseId]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Give it a title.');
    if (!form.due) return setError('Pick a due date.');
    const payload = {
      title: form.title.trim(),
      notes: form.notes.trim() || null,
      due_at: localInputToUtc(form.due),
      type: form.type,
      course_id: form.course_id || null,
      priority: form.priority ? Number(form.priority) : null,
    };
    try {
      if (editing) await update.mutateAsync({ id: assignment.id, ...payload });
      else await create.mutateAsync(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  const busy = create.isPending || update.isPending;

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit deadline' : 'New deadline'}>
      <form onSubmit={submit}>
        <Field label="Title">
          <input autoFocus value={form.title} onChange={set('title')} placeholder="Research essay draft" style={fieldStyle} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <Field label="Due date & time">
            <input type="datetime-local" value={form.due} onChange={set('due')} style={fieldStyle} />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={set('type')} style={fieldStyle}>
              {TYPES.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
            </select>
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <Field label="Course">
            <select value={form.course_id} onChange={set('course_id')} style={fieldStyle}>
              <option value="">— None —</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select value={form.priority} onChange={set('priority')} style={fieldStyle}>
              <option value="">Auto</option>
              {[1, 2, 3, 4, 5].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Notes (optional)">
          <textarea value={form.notes} onChange={set('notes')} rows={3} placeholder="Submit via Turnitin. 2000 words." style={{ ...fieldStyle, resize: 'vertical' }} />
        </Field>

        {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', margin: '0 0 0.8rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button as="button" type="submit" variant="accent" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add deadline'}</Button>
        </div>
      </form>
    </Modal>
  );
}

function initial(a, defaultCourseId) {
  return {
    title: a?.title ?? '',
    notes: a?.notes ?? '',
    due: a?.due_at ? utcToLocalInput(a.due_at) : defaultLocalSoon(),
    type: a?.type ?? 'assignment',
    course_id: a?.course_id ?? defaultCourseId ?? '',
    priority: a?.priority ?? '',
  };
}

function defaultLocalSoon() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(23, 59, 0, 0);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
