import React from 'react';

export default function Spinner({ label, size = 28 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem', color: 'var(--ink-muted)' }}>
      <span
        style={{
          width: size, height: size, borderRadius: '50%',
          border: '2.5px solid var(--line)', borderTopColor: 'var(--accent)',
          animation: 'dm-spin 0.7s linear infinite', display: 'inline-block',
        }}
      />
      {label && <span style={{ fontSize: '0.9rem' }}>{label}</span>}
      <style>{`@keyframes dm-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
