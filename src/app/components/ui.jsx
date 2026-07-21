import React from 'react';

// Small shared building blocks for the product pages.

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', margin: 0, letterSpacing: '-0.03em', color: 'var(--ink)' }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--ink-muted)', margin: '0.35rem 0 0', fontSize: '0.95rem' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px dashed var(--line-strong)', borderRadius: 'var(--radius-xl)', color: 'var(--ink-muted)' }}>
      {Icon && <Icon size={30} strokeWidth={1.6} style={{ color: 'var(--ink-faint)', marginBottom: '0.8rem' }} />}
      <div style={{ fontSize: '1.02rem', fontWeight: 550, color: 'var(--ink)' }}>{title}</div>
      {hint && <div style={{ fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: 340, marginInline: 'auto' }}>{hint}</div>}
      {action && <div style={{ marginTop: '1.2rem' }}>{action}</div>}
    </div>
  );
}

export const fieldStyle = {
  width: '100%', minHeight: 44, padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--line-strong)', background: 'var(--panel)', color: 'var(--ink)',
  fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)',
};

export function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: '0.9rem' }}>
      <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 550, color: 'var(--ink-soft)', marginBottom: '0.35rem' }}>{label}</span>
      {children}
    </label>
  );
}
