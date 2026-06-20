import React from 'react';
import { Icons } from './ui/icons.jsx';

export default function AnnouncementBar({ onCta }) {
  return (
    <div style={{ position: 'relative', background: 'var(--ink)', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(30rem 8rem at 30% 0%, rgba(99,102,241,0.45), transparent 70%), radial-gradient(28rem 8rem at 75% 100%, rgba(0,184,217,0.35), transparent 70%)' }} />
      <div className="dm-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 40, flexWrap: 'wrap', textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
          <Icons.Sparkles size={14} color="var(--brand-lime)" />
          New semester, fresh start — Pro is free for 14 days, no card required.
        </span>
        <button onClick={onCta} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
          Claim it <Icons.ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
