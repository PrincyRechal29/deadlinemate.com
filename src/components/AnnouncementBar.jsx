import React from 'react';

export default function AnnouncementBar({ onCta }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line)', background: 'var(--page-2)' }}>
      <div className="dm-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 38, flexWrap: 'wrap', textAlign: 'center' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
          New semester — Pro is free for 14 days, no card required.
        </span>
        <button onClick={onCta} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)' }}>
          Claim it →
        </button>
      </div>
    </div>
  );
}
