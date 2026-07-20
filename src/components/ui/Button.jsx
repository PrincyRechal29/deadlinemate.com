import React from 'react';

/**
 * DeadlineMate action button. Pill-shaped, quiet colors — but with a
 * Duolingo-style springy press: lifts on hover, squashes down on click with
 * a bouncy ease.
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
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '0 1.05rem', height: 38, fontSize: '0.85rem', gap: '0.4rem' },
    md: { padding: '0 1.4rem', height: 46, fontSize: '0.92rem', gap: '0.5rem' },
    lg: { padding: '0 1.75rem', height: 52, fontSize: '0.98rem', gap: '0.55rem' },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: s.gap, height: s.height, padding: s.padding, width: full ? '100%' : 'auto',
    fontFamily: 'var(--font-body)', fontWeight: 550, fontSize: s.fontSize, lineHeight: 1,
    borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent',
    transition: 'transform 0.28s var(--ease-bounce), background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
    opacity: disabled ? 0.5 : 1, textDecoration: 'none', whiteSpace: 'nowrap',
  };

  const variants = {
    primary: { color: 'var(--btn-primary-text)', background: 'var(--ink)', hoverBg: 'var(--btn-primary-hover)' },
    accent: { color: '#ffffff', background: 'var(--accent)', hoverBg: 'var(--accent-deep)' },
    secondary: { color: 'var(--ink)', background: 'var(--panel)', borderColor: 'var(--line-strong)', hoverBg: 'var(--panel-2)' },
    ghost: { color: 'var(--ink-soft)', background: 'transparent', hoverBg: 'var(--panel)' },
  };
  const v = variants[variant] || variants.primary;

  const Tag = as;
  const onEnter = (e) => {
    if (disabled) return;
    e.currentTarget.style.background = v.hoverBg;
    e.currentTarget.style.transform = 'translateY(-2px)';
  };
  const onLeave = (e) => {
    e.currentTarget.style.background = v.background;
    e.currentTarget.style.transform = 'none';
  };
  const onDown = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'translateY(1px) scale(0.96)';
  };
  const onUp = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
  };

  return (
    <Tag
      style={{ ...base, color: v.color, background: v.background, borderColor: v.borderColor || 'transparent', ...style }}
      disabled={Tag === 'button' ? disabled : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}

export default Button;
