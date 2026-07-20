import React from 'react';

const URG = {
  critical: 'var(--urg-critical)',
  high: 'var(--urg-high)',
  medium: 'var(--urg-medium)',
  low: 'var(--urg-low)',
};

/**
 * The signature product row: one deadline. A small urgency dot, the title,
 * quiet meta, and a trailing slot — nothing else.
 */
export function DeadlineRow({ title, course = '', due = '', urgency = 'medium', trailing = null, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const c = URG[urgency] || URG.medium;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
        padding: '0.75rem 0.9rem',
        borderRadius: 'var(--radius-md)',
        background: hover ? 'var(--panel-2)' : 'var(--panel)',
        border: '1px solid var(--line)',
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 550, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
          {(course || due) && <p style={{ margin: '0.14rem 0 0', fontSize: '0.74rem', color: 'var(--ink-muted)' }}>{[course, due].filter(Boolean).join(' · ')}</p>}
        </div>
      </div>
      {trailing}
    </div>
  );
}

export default DeadlineRow;
