import React from 'react';

/**
 * The DeadlineMate lockup. Accent (indigo->violet) calendar-check mark + the
 * wordmark with its "Academic OS" subtitle. `compact` shows the mark only.
 */
export function Logo({ compact = false, size = 40, subtitle = 'Academic OS', onDark = false }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
      <span
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: size * 0.32,
          background: 'var(--grad-accent)',
          color: '#fff',
          boxShadow: '0 8px 20px -8px rgba(79,70,229,0.8)',
        }}
      >
        <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
          <path d="M3 10h18" />
          <path d="m16 20 2 2 4-4" />
        </svg>
      </span>
      {!compact && (
        <span className="dm-logo-word" style={{ lineHeight: 1 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: size * 0.42, fontWeight: 700, letterSpacing: '-0.02em', color: onDark ? '#fff' : 'var(--ink)' }}>
            DeadlineMate
          </span>
          {subtitle && (
            <span style={{ display: 'block', marginTop: size * 0.07, fontSize: size * 0.24, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: onDark ? 'rgba(255,255,255,0.6)' : 'var(--ink-muted)' }}>
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

export default Logo;
