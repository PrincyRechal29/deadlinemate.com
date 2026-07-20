import React from 'react';

/**
 * Quiet surface. White with a hairline by default; `grey` renders the soft
 * whisper-grey showcase panel. `hover` adds a barely-there lift.
 */
export function Card({ children, hover = false, grey = false, padding = 'lg', style = {}, ...rest }) {
  const pads = { none: 0, sm: '1rem', md: '1.4rem', lg: '1.8rem', xl: '2.4rem' };
  const [lifted, setLifted] = React.useState(false);

  return (
    <div
      onMouseEnter={() => hover && setLifted(true)}
      onMouseLeave={() => hover && setLifted(false)}
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: pads[padding],
        color: 'var(--ink)',
        background: grey ? 'var(--page-2)' : 'var(--panel)',
        border: `1px solid ${grey ? 'var(--line-soft)' : lifted ? 'var(--line-strong)' : 'var(--line)'}`,
        boxShadow: lifted ? 'var(--shadow-md)' : 'none',
        transition: 'box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
        transform: lifted ? 'translateY(-2px)' : 'none',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
