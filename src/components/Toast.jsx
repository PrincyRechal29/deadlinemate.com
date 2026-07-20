import React from 'react';
import { Icons } from './ui/icons.jsx';

export default function Toast({ show, onClose }) {
  React.useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 3200);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 'var(--radius-lg)', background: 'var(--panel-solid)', border: '1px solid var(--line)', color: 'var(--ink)', boxShadow: 'var(--shadow-lg)', animation: 'dmtoast 0.3s var(--ease-out)' }}>
      <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: '50%', background: 'var(--urg-low)' }}><Icons.Check size={15} color="#fff" /></span>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>You're on the list!</p>
        <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Check your inbox to start your free plan.</p>
      </div>
    </div>
  );
}
