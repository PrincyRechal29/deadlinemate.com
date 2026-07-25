// ============================================================================
// TeamMembers — the roster + invite surface. Add teammates by sharing the join
// code or a one-click invite link; both drop them straight into this team.
// ============================================================================
import React from 'react';
import { Copy, Check, Link2, Crown, Pencil } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider.jsx';
import { useTeamMembers } from '../lib/teamApi.js';

const PALETTE = ['#0a9cba', '#8b5cf6', '#e5484d', '#dc9a00', '#30a46c', '#ec4899', '#0ea5e9'];
function colorFor(id) { let h = 0; for (let i = 0; i < (id || '').length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return PALETTE[h % PALETTE.length]; }
function initials(name) { return (name || 'T').trim().slice(0, 1).toUpperCase(); }

const roleMeta = {
  owner: { label: 'Owner', icon: Crown, color: 'var(--urg-high, #dc9a00)' },
  editor: { label: 'Editor', icon: Pencil, color: 'var(--accent-deep)' },
  member: { label: 'Member', icon: null, color: 'var(--ink-muted)' },
};

export default function TeamMembers({ cls }) {
  const { user } = useAuth();
  const { data: members = [], isLoading } = useTeamMembers(cls?.id);
  const [copied, setCopied] = React.useState('');

  const inviteLink = `${window.location.origin}/app/classes?join=${encodeURIComponent(cls?.join_code || '')}`;

  const copy = (what, value) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(what); setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div>
      {/* invite */}
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)', padding: '1.1rem 1.2rem', marginBottom: '1.4rem' }}>
        <div style={{ fontWeight: 650, color: 'var(--ink)', marginBottom: '0.2rem' }}>Add teammates</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', margin: '0 0 0.9rem' }}>
          Share the join code or the invite link. Anyone who uses it joins this team — chat and calls included.
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid var(--line)', borderRadius: 10, padding: '0.35rem 0.35rem 0.35rem 0.85rem', background: 'var(--page-2)' }}>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--ink)' }}>{cls?.join_code}</code>
            <button onClick={() => copy('code', cls?.join_code || '')} style={copyBtn}>
              {copied === 'code' ? <Check size={15} /> : <Copy size={15} />} {copied === 'code' ? 'Copied' : 'Copy code'}
            </button>
          </div>
          <button onClick={() => copy('link', inviteLink)} style={{ ...copyBtn, border: '1px solid var(--line)', background: 'var(--panel)', padding: '0.55rem 0.9rem' }}>
            {copied === 'link' ? <Check size={15} /> : <Link2 size={15} />} {copied === 'link' ? 'Link copied' : 'Copy invite link'}
          </button>
        </div>
      </div>

      {/* roster */}
      <h3 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '0 0 0.7rem' }}>
        Team · {members.length} {members.length === 1 ? 'member' : 'members'}
      </h3>
      {isLoading ? (
        <div style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>Loading members…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {members.map((m) => {
            const meta = roleMeta[m.role] || roleMeta.member;
            const RoleIcon = meta.icon;
            const mine = m.user_id === user?.id;
            return (
              <div key={m.user_id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 0.9rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--panel)' }}>
                <span style={{ width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 600, background: colorFor(m.user_id), flexShrink: 0 }}>
                  {initials(m.display_name)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                    {m.display_name || 'Teammate'} {mine && <span style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', fontWeight: 500 }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--ink-faint)' }}>
                    Joined {new Date(m.joined_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem', fontWeight: 650, color: meta.color, background: 'var(--panel-2)', padding: '3px 9px', borderRadius: 999 }}>
                  {RoleIcon && <RoleIcon size={12} />} {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const copyBtn = { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)', background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 8, padding: '0.5rem 0.8rem', cursor: 'pointer' };
