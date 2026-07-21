import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, maxWidth = 480 }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(10,12,14,.38)', backdropFilter: 'blur(2px)', display: 'grid', placeItems: 'center', padding: '1.2rem' }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth, background: 'var(--panel-solid)', border: '1px solid var(--line)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.4rem 0.9rem' }}>
          <h2 style={{ fontSize: '1.15rem', margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', padding: 4 }}><X size={20} /></button>
        </div>
        <div style={{ padding: '0.4rem 1.4rem 1.4rem' }}>{children}</div>
      </div>
    </div>
  );
}
