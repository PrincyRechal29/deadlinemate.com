// ============================================================================
// CallRoom — the live video/audio surface for a team call.
//
// Wraps the Daily.co prebuilt call (grid, mic/cam/screenshare controls) inside
// our own chrome so we can show a live "N in call" headcount and a clean
// Leave/End action. On mount it logs the join server-side (dm_join_call) and
// pulls a scoped room token from the daily-room edge function; on close it logs
// the leave (dm_leave_call), which auto-ends the call when the last person goes.
// ============================================================================
import React from 'react';
import DailyIframe from '@daily-co/daily-js';
import { Phone, Users, X, Video, Mic, AlertTriangle } from 'lucide-react';
import { joinCall, leaveCall } from '../lib/teamApi.js';

export default function CallRoom({ call, onClose }) {
  const holderRef = React.useRef(null);
  const frameRef = React.useRef(null);
  const [phase, setPhase] = React.useState('connecting'); // connecting | live | error
  const [count, setCount] = React.useState(0);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    let frame = null;

    (async () => {
      try {
        const access = await joinCall(call.id); // { url, token, kind }
        if (cancelled || !holderRef.current) return;

        frame = DailyIframe.createFrame(holderRef.current, {
          showLeaveButton: false,        // we render our own
          showFullscreenButton: true,
          iframeStyle: { width: '100%', height: '100%', border: '0', borderRadius: '0' },
        });
        frameRef.current = frame;

        const updateCount = () => {
          try { setCount(Object.keys(frame.participants() || {}).length); } catch { /* noop */ }
        };
        frame
          .on('joined-meeting', () => { if (!cancelled) { setPhase('live'); updateCount(); } })
          .on('participant-joined', updateCount)
          .on('participant-left', updateCount)
          .on('participant-updated', updateCount)
          .on('left-meeting', () => { if (!cancelled) handleClose(); })
          .on('error', (e) => { if (!cancelled) { setError(e?.errorMsg || 'The call dropped.'); setPhase('error'); } });

        await frame.join({ url: access.url, token: access.token });
      } catch (e) {
        if (!cancelled) { setError(e.message || 'Could not join the call.'); setPhase('error'); }
      }
    })();

    return () => {
      cancelled = true;
      const f = frameRef.current;
      if (f) { try { f.leave(); } catch { /* noop */ } try { f.destroy(); } catch { /* noop */ } }
      frameRef.current = null;
      // Best-effort: mark ourselves as left (auto-ends when we're the last one).
      leaveCall(call.id).catch(() => { /* noop */ });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.id]);

  const handleClose = React.useCallback(() => {
    const f = frameRef.current;
    if (f) { try { f.leave(); } catch { /* noop */ } }
    onClose?.();
  }, [onClose]);

  const KindIcon = call.kind === 'audio' ? Mic : Video;

  return (
    <div style={overlay} role="dialog" aria-label="Team call">
      <div style={shell}>
        {/* header */}
        <div style={header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
            <span style={kindBadge}><KindIcon size={15} /> {call.kind === 'audio' ? 'Audio' : 'Video'} call</span>
            <span style={{ fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {call.title || 'Team call'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <span style={liveCount} aria-live="polite">
              <Users size={14} /> {count} in call
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#30d158', boxShadow: '0 0 0 3px rgba(48,209,88,.25)' }} />
            </span>
            <button onClick={handleClose} style={leaveBtn}>
              <Phone size={15} style={{ transform: 'rotate(135deg)' }} /> Leave
            </button>
            <button onClick={handleClose} aria-label="Close" style={closeBtn}><X size={18} /></button>
          </div>
        </div>

        {/* stage */}
        <div style={{ position: 'relative', flex: 1, background: '#0b0e12' }}>
          <div ref={holderRef} style={{ position: 'absolute', inset: 0 }} />
          {phase === 'connecting' && (
            <div style={centered}>
              <div style={spinner} />
              <p style={{ color: '#c6cbd4', marginTop: '1rem', fontSize: '0.9rem' }}>Connecting you to the call…</p>
            </div>
          )}
          {phase === 'error' && (
            <div style={centered}>
              <AlertTriangle size={30} color="#ff6b6b" />
              <p style={{ color: '#fff', marginTop: '0.8rem', fontWeight: 600 }}>Couldn't join the call</p>
              <p style={{ color: '#9aa1ab', marginTop: '0.3rem', fontSize: '0.86rem', maxWidth: 340, textAlign: 'center' }}>{error}</p>
              <button onClick={handleClose} style={{ ...leaveBtn, marginTop: '1.1rem' }}>Close</button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes dm-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(6,9,12,0.86)',
  backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', padding: 'clamp(0px, 2vw, 24px)',
};
const shell = {
  width: 'min(1100px, 100%)', height: 'min(760px, 100%)', display: 'flex', flexDirection: 'column',
  background: '#12161c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden',
  boxShadow: '0 40px 90px -30px rgba(0,0,0,0.7)',
};
const header = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
  padding: '0.8rem 1rem', background: '#0e1116', borderBottom: '1px solid rgba(255,255,255,0.08)',
};
const kindBadge = {
  display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', fontWeight: 600,
  color: '#7fe0f0', background: 'rgba(10,156,186,0.18)', padding: '3px 9px', borderRadius: 999,
};
const liveCount = {
  display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 650,
  color: '#e7eaef', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
  padding: '5px 11px', borderRadius: 999, fontVariantNumeric: 'tabular-nums',
};
const leaveBtn = {
  display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', fontWeight: 700,
  color: '#fff', background: '#e5484d', border: '0', borderRadius: 9, padding: '0.5rem 0.95rem', cursor: 'pointer',
};
const closeBtn = {
  display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 9,
  color: '#9aa1ab', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
};
const centered = {
  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
};
const spinner = {
  width: 34, height: 34, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.15)',
  borderTopColor: '#0a9cba', animation: 'dm-spin 0.8s linear infinite',
};
