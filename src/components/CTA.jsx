import React from 'react';
import { Button } from './ui/Button.jsx';
import { Icons } from './ui/icons.jsx';

export default function CTA({ onCta }) {
  return (
    <section style={{ position: 'relative', padding: '0 0 88px' }}>
      <div className="dm-wrap">
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', padding: 'clamp(40px,6vw,72px) clamp(28px,5vw,56px)', textAlign: 'center', color: '#fff', background: 'radial-gradient(40rem 18rem at 12% -10%, rgba(99,102,241,0.5), transparent 60%), radial-gradient(36rem 18rem at 100% 0%, rgba(0,184,217,0.4), transparent 55%), var(--ink)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="grid-bg-dark" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'relative' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--brand-lime)' }} /> FREE FOREVER PLAN
            </span>
            <h2 style={{ margin: '22px auto 0', maxWidth: '42rem', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.6vw,3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              Take control before the<br />semester controls you.
            </h2>
            <p style={{ margin: '20px auto 0', maxWidth: '34rem', fontSize: '1.1rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.74)' }}>
              Join thousands of students who stopped missing deadlines. Free to start, no credit card needed.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" size="lg" iconRight={<Icons.ArrowRight size={18} />} onClick={onCta}>Start free</Button>
              <Button variant="dark" size="lg" as="a" href="#pricing" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>See pricing</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
