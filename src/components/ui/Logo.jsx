import React from 'react';

/**
 * The DeadlineMate lockup. The mark is a cyan gradient squircle holding a
 * deadline ring — a progress arc at 75%, time still in hand — with a bold
 * check inside: work confirmed done before the ring closes. The wordmark
 * pairs ink "Deadline" with a cyan "Mate". The mark wiggles on hover.
 */
export function Logo({ compact = false, size = 34 }) {
  const id = React.useId();
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
      <svg className="dm-logo-mark" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="DeadlineMate logo" style={{ flexShrink: 0, display: 'block' }}>
        <defs>
          <linearGradient id={id} x1="8" y1="6" x2="58" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e6c877" />
            <stop offset="1" stopColor="#b08a2e" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="19" fill={`url(#${id})`} />
        <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4.5" />
        <circle cx="32" cy="32" r="18" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="84.8 113.1" transform="rotate(-90 32 32)" />
        <path d="M24.5 33.5l5.5 5.7 10-12.4" fill="none" stroke="#ffffff" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && (
        <span className="dm-logo-word" style={{ fontFamily: 'var(--font-display)', fontSize: size * 0.5, fontWeight: 650, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1 }}>
          Deadline<span style={{ color: 'var(--accent)' }}>Mate</span>
        </span>
      )}
    </span>
  );
}

export default Logo;
