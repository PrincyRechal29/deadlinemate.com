import React from 'react';

/**
 * Halo — a single soft radial tint behind a floating panel. The page's one
 * piece of atmosphere; keep it barely visible.
 */
export function Halo({ color = 'var(--accent-glow)', width = '52rem', height = '26rem', top = '-6rem', style = {} }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute', left: '50%', top, transform: 'translateX(-50%)',
        width, height, borderRadius: '50%',
        background: `radial-gradient(closest-side, ${color}, transparent)`,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

/** Plain urgency dot. */
export function Dot({ color, size = 7 }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 }} />;
}

export default Halo;
