import React from 'react';

/**
 * Quiet status chip. Sentence case, soft tint, no border noise. Urgency tones
 * (critical/high/medium/low) are the product's deadline language.
 */
export function Badge({ children, tone = 'neutral', dot = false, size = 'md', ...rest }) {
  const tones = {
    neutral: { color: 'var(--ink-muted)', bg: 'var(--panel-2)', dot: 'var(--ink-faint)' },
    accent: { color: 'var(--accent-deep)', bg: 'var(--accent-soft)', dot: 'var(--accent)' },
    success: { color: 'var(--tone-success-text)', bg: 'var(--urg-low-soft)', dot: 'var(--urg-low)' },
    critical: { color: 'var(--tone-critical-text)', bg: 'var(--urg-critical-soft)', dot: 'var(--urg-critical)' },
    high: { color: 'var(--tone-high-text)', bg: 'var(--urg-high-soft)', dot: 'var(--urg-high)' },
    medium: { color: 'var(--tone-medium-text)', bg: 'var(--urg-medium-soft)', dot: 'var(--urg-medium)' },
    low: { color: 'var(--tone-success-text)', bg: 'var(--urg-low-soft)', dot: 'var(--urg-low)' },
  };
  const t = tones[tone] || tones.neutral;
  const pad = size === 'sm' ? '0.22rem 0.55rem' : '0.32rem 0.7rem';
  const fz = size === 'sm' ? '0.7rem' : '0.76rem';

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.38rem', padding: pad,
        fontSize: fz, fontWeight: 550, lineHeight: 1, letterSpacing: '0.005em',
        color: t.color, background: t.bg, borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
      }}
      {...rest}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />}
      {children}
    </span>
  );
}

export default Badge;
