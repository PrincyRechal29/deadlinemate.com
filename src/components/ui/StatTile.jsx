import React from 'react';

/** Compact metric tile for the dashboard mock — quiet, hairline, no icons required. */
export function StatTile({ icon = null, value, label, accent = 'var(--ink-muted)' }) {
  return (
    <div style={{ padding: '0.95rem 1.05rem', background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)' }}>
      {icon && <span style={{ color: accent, display: 'grid', width: 17, height: 17 }}>{icon}</span>}
      <p style={{ margin: icon ? '0.55rem 0 0' : 0, fontSize: '1.35rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{value}</p>
      <p style={{ margin: '0.15rem 0 0', fontSize: '0.74rem', color: 'var(--ink-muted)' }}>{label}</p>
    </div>
  );
}

export default StatTile;
