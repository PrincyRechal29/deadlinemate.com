// ============================================================================
// TeamChat — real-time team chat. Messages stream in over Supabase Realtime;
// sending optimistically appends so it feels instant.
// ============================================================================
import React from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider.jsx';
import { useTeamMessages, useSendMessage, useMemberMap } from '../lib/teamApi.js';

function initials(name, fallback) {
  const s = (name || fallback || '?').trim();
  return s.slice(0, 1).toUpperCase();
}

function dayLabel(d) {
  const now = new Date();
  const same = (a, b) => a.toDateString() === b.toDateString();
  if (same(d, now)) return 'Today';
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (same(d, y)) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

const PALETTE = ['#0a9cba', '#8b5cf6', '#e5484d', '#dc9a00', '#30a46c', '#ec4899', '#0ea5e9'];
function colorFor(id) {
  let h = 0; for (let i = 0; i < (id || '').length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export default function TeamChat({ classId }) {
  const { user } = useAuth();
  const { data: messages = [], isLoading } = useTeamMessages(classId);
  const send = useSendMessage(classId);
  const { byId } = useMemberMap(classId);
  const [text, setText] = React.useState('');
  const endRef = React.useRef(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    // Stick to the bottom when new messages land.
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || send.isPending) return;
    setText('');
    send.mutate(t);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(e); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'min(64vh, 620px)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)', overflow: 'hidden' }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.1rem' }}>
        {isLoading ? (
          <div style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>Loading messages…</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ink-faint)', padding: '2.5rem 1rem', fontSize: '0.9rem' }}>
            No messages yet — say hi to your team 👋
          </div>
        ) : (
          messages.map((m, i) => {
            const prev = messages[i - 1];
            const d = new Date(m.created_at);
            const showDay = !prev || new Date(prev.created_at).toDateString() !== d.toDateString();
            const mine = m.user_id === user?.id;
            const person = byId[m.user_id];
            const name = mine ? 'You' : (person?.display_name || 'Teammate');
            const grouped = prev && prev.user_id === m.user_id && !showDay &&
              (d - new Date(prev.created_at)) < 4 * 60 * 1000;
            return (
              <React.Fragment key={m.id}>
                {showDay && (
                  <div style={{ textAlign: 'center', margin: '0.8rem 0 0.9rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--ink-faint)', background: 'var(--panel-2)', padding: '3px 10px', borderRadius: 999 }}>{dayLabel(d)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.65rem', marginTop: grouped ? '0.15rem' : '0.7rem', flexDirection: mine ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 30, flexShrink: 0 }}>
                    {!grouped && (
                      <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '0.78rem', fontWeight: 600, background: colorFor(m.user_id) }}>
                        {initials(person?.display_name, mine ? 'Y' : 'T')}
                      </span>
                    )}
                  </div>
                  <div style={{ maxWidth: '76%', minWidth: 0 }}>
                    {!grouped && (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: 3, flexDirection: mine ? 'row-reverse' : 'row' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>{name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--ink-faint)' }}>{d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                    )}
                    <div style={{
                      display: 'inline-block', padding: '0.5rem 0.75rem', borderRadius: 12, fontSize: '0.9rem', lineHeight: 1.45,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'left',
                      color: mine ? '#fff' : 'var(--ink)',
                      background: mine ? 'var(--accent)' : 'var(--panel-2)',
                      borderTopLeftRadius: mine ? 12 : (grouped ? 12 : 4),
                      borderTopRightRadius: mine ? (grouped ? 12 : 4) : 12,
                    }}>{m.body}</div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', padding: '0.7rem', borderTop: '1px solid var(--line-soft)', background: 'var(--panel)' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Message your team…  (Enter to send, Shift+Enter for a new line)"
          style={{ flex: 1, resize: 'none', maxHeight: 120, border: '1px solid var(--line)', borderRadius: 10, padding: '0.6rem 0.8rem', fontSize: '0.9rem', background: 'var(--page-2)', color: 'var(--ink)', outline: 'none', fontFamily: 'inherit' }}
        />
        <button type="submit" disabled={!text.trim() || send.isPending} aria-label="Send"
          style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, flexShrink: 0, borderRadius: 10, border: 0, cursor: text.trim() ? 'pointer' : 'default', color: '#fff', background: text.trim() ? 'var(--accent)' : 'var(--line-strong)', transition: 'background .16s' }}>
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
