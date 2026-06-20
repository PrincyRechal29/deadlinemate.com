import React from 'react';

/**
 * DeadlineMate primary action. Pill-shaped, gradient-filled for the main CTA;
 * outlined and ghost variants for secondary actions. Lifts 2px on hover.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  full = false,
  as = 'button',
  ...rest
}) {
  const sizes = {
    sm: { padding: '0 0.95rem', height: 36, fontSize: '0.82rem', gap: '0.4rem' },
    md: { padding: '0 1.4rem', height: 44, fontSize: '0.9rem', gap: '0.5rem' },
    lg: { padding: '0 1.75rem', height: 52, fontSize: '0.98rem', gap: '0.55rem' },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: full ? '100%' : 'auto',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: s.fontSize,
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent',
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  const variants = {
    primary: {
      color: '#fff',
      background: 'var(--grad-accent)',
      boxShadow: 'var(--shadow-accent)',
    },
    secondary: {
      color: 'var(--ink)',
      background: 'var(--surface)',
      borderColor: 'var(--line-strong)',
      boxShadow: 'var(--shadow-sm)',
    },
    ghost: {
      color: 'var(--ink-soft)',
      background: 'transparent',
    },
    dark: {
      color: '#fff',
      background: 'var(--ink)',
    },
  };

  const Tag = as;
  const onEnter = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'translateY(-2px)';
    if (variant === 'primary') e.currentTarget.style.filter = 'brightness(1.05)';
    if (variant === 'secondary') e.currentTarget.style.borderColor = 'rgba(79,70,229,0.4)';
    if (variant === 'ghost') e.currentTarget.style.background = 'var(--accent-soft)';
  };
  const onLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.filter = 'none';
    if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--line-strong)';
    if (variant === 'ghost') e.currentTarget.style.background = 'transparent';
  };

  return (
    <Tag
      style={{ ...base, ...variants[variant] }}
      disabled={Tag === 'button' ? disabled : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}

export default Button;
