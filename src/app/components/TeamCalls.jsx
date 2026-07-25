// ============================================================================
// TeamCalls — start an instant video/audio call, schedule one for later, join
// a live call, and browse call history (who joined, how many, how long).
// ============================================================================
import React from 'react';
import { Video, Mic, CalendarPlus, Phone, Users, Clock, X, PlayCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider.jsx';
import { useCalls, useCallActions, useCallParticipants } from '../lib/teamApi.js';
import { localInputToUtc } from '../lib/dates.js';
import Modal from './Modal.jsx';
import { Field, fieldStyle } from './ui.jsx';
import Button from '../../components/ui/Button.jsx';

// Lazy — the Daily video SDK (~200 kB) only loads when a call actually opens,
// so it never weighs down the Deadlines/Chat/Members tabs.
const CallRoom = React.lazy(() => import('./CallRoom.jsx'));

function fmtDuration(startedAt, endedAt) {
  if (!startedAt || !endedAt) return null;
  const ms = new Date(endedAt) - new Date(startedAt);
  if (ms < 0) return null;
  const mins = Math.round(ms / 60000);
  if (mins < 1) return '<1 min';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function fmtWhen(iso) {
  const d = new Date(iso);
  const now = new Date();
  const opts = { hour: 'numeric', minute: '2-digit' };
  if (d.toDateString() === now.toDateString()) return `Today ${d.toLocaleTimeString([], opts)}`;
  const t = new Date(now); t.setDate(now.getDate() + 1);
  if (d.toDateString() === t.toDateString()) return `Tomorrow ${d.toLocaleTimeString([], opts)}`;
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString([], opts);
}

/* Live-call row — shows a real-time headcount and a Join button. */
function LiveRow({ call, onJoin, onEnd, canEnd }) {
  const { data: p } = useCallParticipants(call.id);
  const Kind = call.kind === 'audio' ? Mic : Video;
  return (
    <div style={row}>
      <span style={{ ...iconWrap, background: 'var(--low-soft, rgba(48,164,108,.12))', color: 'var(--urg-low)' }}><Kind size={17} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{call.title || `${call.kind === 'audio' ? 'Audio' : 'Video'} call`}</span>
          <span style={liveTag}><span style={liveDot} /> Live</span>
        </div>
        <div style={sub}>
          <Users size={13} /> {(p?.liveCount ?? 0)} in call{p?.joinedCount ? ` · ${p.joinedCount} joined so far` : ''}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {canEnd && <button onClick={() => onEnd(call.id)} style={ghostBtn}>End</button>}
        <button onClick={() => onJoin(call)} style={joinBtn}><Phone size={15} /> Join</button>
      </div>
    </div>
  );
}

export default function TeamCalls({ classId }) {
  const { user } = useAuth();
  const { data: calls = [], isLoading } = useCalls(classId);
  const { startCall, scheduleCall, cancelCall } = useCallActions(classId);
  const [active, setActive] = React.useState(null); // call open in CallRoom
  const [schedOpen, setSchedOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', kind: 'video', when: '' });
  const [err, setErr] = React.useState('');

  const live = calls.filter((c) => c.status === 'live');
  const upcoming = calls
    .filter((c) => c.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  const history = calls.filter((c) => c.status === 'ended' || c.status === 'cancelled');

  const start = async (kind) => {
    setErr('');
    try {
      const call = await startCall.mutateAsync({ kind });
      setActive(call);
    } catch (e) { setErr(e.message || 'Could not start the call.'); }
  };

  const join = (call) => setActive(call);
  const end = async (id) => { try { await cancelCall.mutateAsync(id); } catch { /* noop */ } };

  const submitSchedule = async (e) => {
    e.preventDefault(); setErr('');
    if (!form.when) return setErr('Pick a date and time.');
    try {
      await scheduleCall.mutateAsync({ when: localInputToUtc(form.when), kind: form.kind, title: form.title.trim() || null });
      setSchedOpen(false); setForm({ title: '', kind: 'video', when: '' });
    } catch (e2) { setErr(e2.message || 'Could not schedule the call.'); }
  };

  return (
    <div>
      {/* start actions */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.3rem' }}>
        <button onClick={() => start('video')} disabled={startCall.isPending} style={primaryBtn}>
          <Video size={17} /> Start video call
        </button>
        <button onClick={() => start('audio')} disabled={startCall.isPending} style={secondaryBtn}>
          <Mic size={17} /> Start audio call
        </button>
        <button onClick={() => { setErr(''); setSchedOpen(true); }} style={secondaryBtn}>
          <CalendarPlus size={17} /> Schedule
        </button>
      </div>
      {err && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '-0.6rem', marginBottom: '1rem' }}>{err}</p>}

      {isLoading ? (
        <div style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>Loading calls…</div>
      ) : (
        <>
          {live.length > 0 && (
            <Section title="Live now">
              {live.map((c) => (
                <LiveRow key={c.id} call={c} onJoin={join} onEnd={end} canEnd={c.created_by === user?.id} />
              ))}
            </Section>
          )}

          <Section title="Upcoming">
            {upcoming.length === 0 ? (
              <Empty>No scheduled calls. Start one now, or schedule a study session.</Empty>
            ) : upcoming.map((c) => {
              const Kind = c.kind === 'audio' ? Mic : Video;
              return (
                <div key={c.id} style={row}>
                  <span style={iconWrap}><Kind size={17} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.title || `${c.kind === 'audio' ? 'Audio' : 'Video'} call`}</div>
                    <div style={sub}><Clock size={13} /> {fmtWhen(c.scheduled_at)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {c.created_by === user?.id && <button onClick={() => end(c.id)} style={ghostBtn}>Cancel</button>}
                    <button onClick={() => join(c)} style={joinBtn}><PlayCircle size={15} /> Join now</button>
                  </div>
                </div>
              );
            })}
          </Section>

          <Section title="History">
            {history.length === 0 ? (
              <Empty>Past calls will show up here with who joined and how long they ran.</Empty>
            ) : history.map((c) => {
              const Kind = c.kind === 'audio' ? Mic : Video;
              const dur = fmtDuration(c.started_at, c.ended_at);
              const when = new Date(c.started_at || c.created_at);
              return (
                <div key={c.id} style={{ ...row, opacity: 0.92 }}>
                  <span style={{ ...iconWrap, background: 'var(--panel-2)', color: 'var(--ink-muted)' }}><Kind size={17} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                      {c.title || `${c.kind === 'audio' ? 'Audio' : 'Video'} call`}
                      {c.status === 'cancelled' && <span style={{ ...tag, color: 'var(--ink-muted)', background: 'var(--panel-2)' }}>Cancelled</span>}
                    </div>
                    <div style={sub}>
                      {when.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      {c.status !== 'cancelled' && (
                        <>
                          <span style={dotSep} /> <Users size={13} /> {c.peak_participants || 0} joined
                          {dur && (<><span style={dotSep} /> <Clock size={13} /> {dur}</>)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Section>
        </>
      )}

      {/* schedule modal */}
      <Modal open={schedOpen} onClose={() => setSchedOpen(false)} title="Schedule a call">
        <form onSubmit={submitSchedule}>
          <Field label="Title (optional)">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Midterm review" style={fieldStyle} />
          </Field>
          <Field label="When">
            <input type="datetime-local" value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} style={fieldStyle} />
          </Field>
          <Field label="Type">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[['video', 'Video', Video], ['audio', 'Audio', Mic]].map(([k, lbl, Ic]) => (
                <button type="button" key={k} onClick={() => setForm({ ...form, kind: k })} style={{
                  flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  padding: '0.55rem', borderRadius: 9, cursor: 'pointer', fontSize: '0.86rem', fontWeight: 600,
                  border: '1px solid ' + (form.kind === k ? 'var(--accent)' : 'var(--line)'),
                  background: form.kind === k ? 'var(--accent-soft)' : 'var(--panel)',
                  color: form.kind === k ? 'var(--accent-deep)' : 'var(--ink-muted)',
                }}><Ic size={16} /> {lbl}</button>
              ))}
            </div>
          </Field>
          {err && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{err}</p>}
          <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="button" variant="ghost" onClick={() => setSchedOpen(false)}>Cancel</Button>
            <Button as="button" type="submit" variant="accent" disabled={scheduleCall.isPending}>Schedule call</Button>
          </div>
        </form>
      </Modal>

      {active && (
        <React.Suspense fallback={null}>
          <CallRoom call={active} onClose={() => setActive(null)} />
        </React.Suspense>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.6rem' }}>
      <h3 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '0 0 0.6rem' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>{children}</div>
    </div>
  );
}
function Empty({ children }) {
  return <div style={{ fontSize: '0.86rem', color: 'var(--ink-faint)', padding: '0.9rem 1rem', border: '1px dashed var(--line)', borderRadius: 'var(--radius-md)' }}>{children}</div>;
}

const row = { display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.8rem 0.95rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)' };
const iconWrap = { width: 38, height: 38, flexShrink: 0, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent-deep)' };
const sub = { display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 3 };
const dotSep = { width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)', display: 'inline-block', margin: '0 0.2rem' };
const tag = { fontSize: '0.68rem', fontWeight: 600, padding: '1px 7px', borderRadius: 999, marginLeft: '0.5rem' };
const liveTag = { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--urg-low, #30a46c)', background: 'var(--urg-low-soft, rgba(48,164,108,.12))', padding: '2px 8px', borderRadius: 999 };
const liveDot = { width: 6, height: 6, borderRadius: '50%', background: 'var(--urg-low, #30a46c)' };

const primaryBtn = { display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.62rem 1.05rem', borderRadius: 10, border: 0, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 650, color: '#fff', background: 'var(--accent)' };
const secondaryBtn = { display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.62rem 1.05rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', background: 'var(--panel)', border: '1px solid var(--line)' };
const joinBtn = { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', borderRadius: 9, border: 0, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 650, color: '#fff', background: 'var(--accent)' };
const ghostBtn = { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', borderRadius: 9, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-muted)', background: 'var(--panel)', border: '1px solid var(--line)' };
