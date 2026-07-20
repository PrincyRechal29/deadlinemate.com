import React from 'react';
import { Reveal } from './motion.jsx';

// Shared layout primitives. Prefer the .dm-wrap class for full-width sections.
export const WRAP = { width: '100%', maxWidth: '74rem', margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' };

/** Cyan eyebrow label — the only recurring accent moment. */
export const Kicker = ({ children }) => <span className="dm-kicker">{children}</span>;

/**
 * Section header. Pure type hierarchy — eyebrow, oversized headline, quiet
 * sub — with an optional trailing `aside` slot on wide screens. Fades up on
 * scroll.
 */
export const SectionHead = ({ kicker, title, sub, align = 'left', aside = null }) => (
  <Reveal
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 24,
      alignItems: 'flex-end',
      justifyContent: aside ? 'space-between' : align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
    }}
  >
    <div style={{ maxWidth: '42rem', margin: align === 'center' ? '0 auto' : 0 }}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2 style={{ margin: kicker ? '14px 0 0' : 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,4vw,2.9rem)', fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--ink)', lineHeight: 1.08 }}>
        {title}
      </h2>
      {sub && <p style={{ margin: '18px 0 0', maxWidth: '36rem', fontSize: '1.08rem', lineHeight: 1.65, color: 'var(--ink-muted)' }}>{sub}</p>}
    </div>
    {aside}
  </Reveal>
);
