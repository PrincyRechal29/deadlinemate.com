import React from 'react';

/**
 * Compact metric tile — icon, big value, label. Used in the hero mock and the
 * app dashboard stat strip.
 */
export function StatTile({ icon = null, value, label, accent = 'var(--accent)' }) {
  return (
    <div
      style={{
        padding: '0.85rem',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {icon && <span style={{ color: accent, display: 'grid', width: 18, height: 18 }}>{icon}</span>}
      <p style={{ margin: '0.5rem 0 0', fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
        {value}
      </p>
      <p style={{ margin: '0.1rem 0 0', fontSize: '0.7rem', color: 'var(--ink-muted)' }}>{label}</p>
    </div>
  );
}

export default StatTile;
