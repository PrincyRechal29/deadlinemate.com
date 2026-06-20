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
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, background: 'var(--ink)', color: '#fff', boxShadow: 'var(--shadow-lg)', animation: 'dmtoast 0.3s var(--ease-out)' }}>
      <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: '50%', background: 'var(--urg-low)' }}><Icons.Check size={16} color="#fff" /></span>
      <div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>You're on the list!</p>
        <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>Check your inbox to start your free plan.</p>
      </div>
    </div>
  );
}
