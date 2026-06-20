import React from 'react';

/**
 * Segmented control — the billing Monthly/Annual toggle and any 2–4 option
 * switch. Selected segment gets the solid ink pill.
 */
export function SegmentedToggle({ options = [], value, onChange, size = 'md' }) {
  const pad = size === 'sm' ? '0.3rem 0.7rem' : '0.45rem 1rem';
  const fz = size === 'sm' ? '0.78rem' : '0.85rem';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {options.map((opt) => {
        const key = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const active = key === value;
        return (
          <button
            key={key}
            onClick={() => onChange && onChange(key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: pad,
              fontSize: fz,
              fontWeight: 600,
              color: active ? '#fff' : 'var(--ink-muted)',
              background: active ? 'var(--ink)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              transition: 'color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
            {typeof opt === 'object' && opt.badge && (
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#047857', background: 'var(--urg-low-soft)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-pill)' }}>
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </span>
  );
}

export default SegmentedToggle;
