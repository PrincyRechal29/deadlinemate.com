import React from 'react';

// Shared layout primitives for the marketing sections.
// WRAP kept for inline use; prefer the .dm-wrap class for full-width sections.
export const WRAP = { maxWidth: '78rem', margin: '0 auto', padding: '0 28px', width: '100%' };

/** Mono kicker label — the structural spine. e.g. <Kicker>Features</Kicker> */
export const Kicker = ({ children, onDark = false }) => (
  <span className={`dm-kicker${onDark ? ' on-dark' : ''}`}>{children}</span>
);

/**
 * Editorial section header. Left-aligned by default (`align`), with an optional
 * trailing slot for actions/meta that sits opposite the heading on wide screens.
 */
export const SectionHead = ({ kicker, title, accent, sub, align = 'left', max = '38rem', aside = null }) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 24,
      alignItems: 'flex-end',
      justifyContent: aside ? 'space-between' : align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
    }}
  >
    <div style={{ maxWidth: max, margin: align === 'center' ? '0 auto' : 0 }}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2 style={{ margin: '18px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.4vw,3rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink)', lineHeight: 1.08 }}>
        {title} {accent && <span className="gradient-text">{accent}</span>}
      </h2>
      {sub && <p style={{ margin: '16px 0 0', maxWidth: '36rem', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>{sub}</p>}
    </div>
    {aside}
  </div>
);
