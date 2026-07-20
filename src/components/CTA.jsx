import React from 'react';
import { Button } from './ui/Button.jsx';
import { Icons } from './ui/icons.jsx';
import { Halo } from './ui/decor.jsx';
import { Reveal } from './ui/motion.jsx';

export default function CTA({ onCta }) {
  return (
    <section className="dm-invert" style={{ position: 'relative', padding: '110px 0', background: 'var(--page)', overflow: 'hidden' }}>
      <Halo top="2rem" />
      <Reveal className="dm-wrap" style={{ position: 'relative', textAlign: 'center' }}>
        <h2 style={{ margin: '0 auto', maxWidth: '30rem', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.1rem,4.6vw,3.4rem)', fontWeight: 620, letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--ink)' }}>
          Take control before the semester controls you.
        </h2>
        <p style={{ margin: '22px auto 0', maxWidth: '32rem', fontSize: '1.08rem', lineHeight: 1.65, color: 'var(--ink-muted)' }}>
          Join thousands of students who stopped missing deadlines. Free to start, no credit card needed.
        </p>
        <div style={{ marginTop: 34, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg" iconRight={<Icons.ArrowRight size={17} />} onClick={onCta}>Start free</Button>
          <Button variant="secondary" size="lg" as="a" href="#pricing">See pricing</Button>
        </div>
        <p style={{ margin: '18px 0 0', fontSize: '0.84rem', color: 'var(--ink-faint)' }}>Free forever plan available</p>
      </Reveal>
    </section>
  );
}
