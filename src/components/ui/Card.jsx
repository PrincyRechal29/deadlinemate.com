import React from 'react';

/**
 * The base surface. Hairline border, 20px radius, soft shadow. `hover` adds
 * the lift-on-hover interaction used across marketing + app grids. `dark`
 * renders the indigo-glow panel used for featured/CTA surfaces.
 */
export function Card({ children, hover = false, dark = false, padding = 'lg', style = {}, ...rest }) {
  const pads = { none: 0, sm: 'var(--space-4)', md: 'var(--space-5)', lg: 'var(--space-6)', xl: 'var(--space-8)' };
  const [lifted, setLifted] = React.useState(false);

  const base = dark
    ? {
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.08)',
        background:
          'radial-gradient(40rem 18rem at 12% -10%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(36rem 18rem at 100% 0%, rgba(124,58,237,0.30), transparent 55%), var(--ink)',
        boxShadow: 'var(--shadow-lg)',
      }
    : {
        color: 'var(--ink)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: hover && lifted ? 'var(--line-strong)' : 'var(--line)',
        background: 'var(--surface)',
        boxShadow: hover && lifted ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      };

  return (
    <div
      onMouseEnter={() => hover && setLifted(true)}
      onMouseLeave={() => hover && setLifted(false)}
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: pads[padding],
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        transform: hover && lifted ? 'translateY(-4px)' : 'none',
        ...base,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
