import React from 'react';
import { DownloadCloud, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useImports, useDeleteImport, useCourses } from '../lib/api.js';
import { invokeFunction } from '../lib/supabase.js';
import { PageHeader, EmptyState, Field, fieldStyle } from '../components/ui.jsx';
import { fmtDue } from '../lib/dates.js';
import Button from '../../components/ui/Button.jsx';

export default function ImportPage() {
  const qc = useQueryClient();
  const { data: imports = [], isLoading } = useImports();
  const { data: courses = [] } = useCourses();
  const del = useDeleteImport();

  const [url, setUrl] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [courseId, setCourseId] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  const [syncing, setSyncing] = React.useState(null);

  const doImport = async (e) => {
    e.preventDefault();
    setBusy(true); setError(''); setResult(null);
    try {
      const r = await invokeFunction('import-calendar', {
        feed_url: url.trim(), label: label.trim() || null, course_id: courseId || null,
      });
      setResult(r);
      setUrl(''); setLabel('');
      qc.invalidateQueries({ queryKey: ['imports'] });
      qc.invalidateQueries({ queryKey: ['assignments'] });
    } catch (err) { setError(err.message); }
    setBusy(false);
  };

  const resync = async (imp) => {
    setSyncing(imp.id);
    try {
      await invokeFunction('import-calendar', { import_id: imp.id });
      qc.invalidateQueries({ queryKey: ['imports'] });
      qc.invalidateQueries({ queryKey: ['assignments'] });
    } catch (err) { alert(err.message); }
    setSyncing(null);
  };

  return (
    <>
      <PageHeader title="Import deadlines" subtitle="Paste a calendar link from Canvas, Moodle, Blackboard or Google Classroom — every deadline syncs automatically." />

      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', background: 'var(--panel)', padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={doImport}>
          <Field label="Calendar feed URL (.ics)">
            <input value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://canvas.university.edu/feeds/calendars/user_xxx.ics" style={fieldStyle} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <Field label="Label (optional)"><input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Canvas – Fall term" style={fieldStyle} /></Field>
            <Field label="Assign to course (optional)">
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)} style={fieldStyle}>
                <option value="">— None —</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          <Button as="button" type="submit" variant="accent" iconLeft={<DownloadCloud size={17} />} disabled={busy}>{busy ? 'Importing…' : 'Import feed'}</Button>
        </form>

        {result && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tone-success-text)', fontSize: '0.9rem' }}>
            <CheckCircle2 size={17} /> Imported {result.imported} new and updated {result.updated} deadlines.
          </div>
        )}
        {error && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.9rem' }}>
            <AlertCircle size={17} /> {error}
          </div>
        )}
        <p style={{ marginTop: '1.1rem', fontSize: '0.8rem', color: 'var(--ink-faint)', lineHeight: 1.5 }}>
          Tip: in Canvas go to Calendar → Calendar Feed; in Google Classroom use the class calendar's “Secret address in iCal format”.
          We re-sync saved feeds automatically every day.
        </p>
      </div>

      <h3 style={{ fontSize: '1rem', margin: '0 0 0.9rem' }}>Connected feeds</h3>
      {isLoading ? (
        <div style={{ color: 'var(--ink-muted)' }}>Loading…</div>
      ) : imports.length === 0 ? (
        <EmptyState icon={DownloadCloud} title="No feeds connected" hint="Import a calendar above to auto-fill your deadlines." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {imports.map((imp) => (
            <div key={imp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.9rem 1.1rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 550, color: 'var(--ink)' }}>{imp.label || imp.provider || 'Calendar feed'}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{imp.feed_url}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--ink-muted)', marginTop: 3 }}>
                  {imp.last_synced ? `Last synced ${fmtDue(imp.last_synced)} · ${imp.last_status || ''}` : 'Not synced yet'}
                </div>
              </div>
              <button onClick={() => resync(imp)} disabled={syncing === imp.id} title="Re-sync now" style={iconBtn}>
                <RefreshCw size={16} style={{ animation: syncing === imp.id ? 'dm-spin 0.8s linear infinite' : 'none' }} />
              </button>
              <button onClick={() => { if (confirm('Remove this feed? Imported deadlines stay unless you delete them.')) del.mutate(imp.id); }} title="Remove feed" style={iconBtn}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes dm-spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

const iconBtn = { width: 36, height: 36, borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', background: 'var(--panel)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--ink-muted)', flexShrink: 0 };
