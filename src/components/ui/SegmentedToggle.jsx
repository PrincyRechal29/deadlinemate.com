import React from 'react';

/** Segmented control (billing toggle). iOS-style: grey track, white active thumb. */
export function SegmentedToggle({ options = [], value, onChange, size = 'md' }) {
  const pad = size === 'sm' ? '0.3rem 0.7rem' : '0.45rem 1rem';
  const fz = size === 'sm' ? '0.78rem' : '0.86rem';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.24rem', background: 'var(--panel-2)', border: '1px solid var(--line-soft)', borderRadius: 'var(--radius-pill)' }}>
      {options.map((opt) => {
        const key = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const active = key === value;
        return (
          <button
            key={key}
            onClick={() => onChange && onChange(key)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: pad,
              fontSize: fz, fontWeight: 550, color: active ? 'var(--ink)' : 'var(--ink-muted)',
              background: active ? '#fff' : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(10,10,11,0.1), 0 0 0 1px var(--line)' : 'none',
              border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
              transition: 'color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)', whiteSpace: 'nowrap',
            }}
          >
            {label}
            {typeof opt === 'object' && opt.badge && (
              <span style={{ fontSize: '0.66rem', fontWeight: 600, color: 'var(--accent-deep)', background: 'var(--accent-soft)', padding: '0.12rem 0.4rem', borderRadius: 'var(--radius-pill)' }}>{opt.badge}</span>
            )}
          </button>
        );
      })}
    </span>
  );
}

export default SegmentedToggle;
