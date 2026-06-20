import React from 'react';

/**
 * Small status pill. The `urgency` tones (critical/high/medium/low) are the
 * product's deadline language; `tone` covers generic neutral/accent/success
 * labels. `dot` prefixes a colored indicator.
 */
export function Badge({ children, tone = 'neutral', dot = false, size = 'md', ...rest }) {
  const tones = {
    neutral: { color: 'var(--ink-soft)', bg: 'var(--page-tint)', dot: 'var(--ink-muted)' },
    accent: { color: 'var(--accent)', bg: 'var(--accent-soft)', dot: 'var(--accent)' },
    success: { color: '#047857', bg: 'var(--success-soft)', dot: 'var(--success)' },
    critical: { color: '#be123c', bg: 'var(--urg-critical-soft)', dot: 'var(--urg-critical)' },
    high: { color: '#c2410c', bg: 'var(--urg-high-soft)', dot: 'var(--urg-high)' },
    medium: { color: '#b45309', bg: 'var(--urg-medium-soft)', dot: 'var(--urg-medium)' },
    low: { color: '#047857', bg: 'var(--urg-low-soft)', dot: 'var(--urg-low)' },
  };
  const t = tones[tone] || tones.neutral;
  const pad = size === 'sm' ? '0.15rem 0.5rem' : '0.3rem 0.7rem';
  const fz = size === 'sm' ? '0.68rem' : '0.74rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: pad,
        fontFamily: 'var(--font-body)',
        fontSize: fz,
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '0.01em',
        color: t.color,
        background: t.bg,
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap',
      }}
      {...rest}
    >
      {dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />}
      {children}
    </span>
  );
}

export default Badge;
