import React from 'react';

const URG = {
  critical: 'var(--urg-critical)',
  high: 'var(--urg-high)',
  medium: 'var(--urg-medium)',
  low: 'var(--urg-low)',
};

/**
 * The signature product row: a single deadline. Urgency dot + title + course
 * meta on the left, due label on the right. Checking it off strikes through.
 * This is what a student scans every morning.
 */
export function DeadlineRow({
  title,
  course = '',
  due = '',
  urgency = 'medium',
  done = false,
  onToggle,
  trailing = null,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        padding: '0.7rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        background: hover ? 'var(--page-tint)' : 'var(--page)',
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <button
          onClick={onToggle}
          aria-label={done ? 'Mark not done' : 'Mark done'}
          style={{
            width: 20,
            height: 20,
            flexShrink: 0,
            borderRadius: '50%',
            cursor: 'pointer',
            border: done ? 'none' : `2px solid ${URG[urgency] || URG.medium}`,
            background: done ? 'var(--success)' : 'transparent',
            display: 'grid',
            placeItems: 'center',
            padding: 0,
          }}
        >
          {done && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </button>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              fontWeight: 600,
              color: done ? 'var(--ink-faint)' : 'var(--ink)',
              textDecoration: done ? 'line-through' : 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </p>
          {(course || due) && (
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
              {[course, due].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
      {trailing}
    </div>
  );
}

export default DeadlineRow;
