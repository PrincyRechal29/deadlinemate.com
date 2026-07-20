import React from 'react';
import { Card } from './ui/Card.jsx';
import { Kicker } from './ui/layout.jsx';
import { Reveal } from './ui/motion.jsx';

const Avatar = ({ a }) => (
  <span style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: '50%', background: 'var(--panel-2)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: '0.86rem', fontWeight: 600, flexShrink: 0 }}>{a}</span>
);

export default function Testimonials() {
  const side = [
    ['It made deadlines feel manageable.', 'The urgency view and study blocks helped me work earlier instead of rushing at midnight.', 'Daniel', 'Engineering, 2nd year', 'D'],
    ['Built for actual university life.', 'Structured enough for modules and exams, but clean enough to open every single morning.', 'Maya', 'Business, final year', 'M'],
  ];
  return (
    <section style={{ padding: '104px 0' }}>
      <div className="dm-wrap">
        {/* One large centered quote */}
        <Reveal style={{ textAlign: 'center', maxWidth: '50rem', margin: '0 auto' }}>
          <Kicker>Loved by students</Kicker>
          <blockquote style={{ margin: '26px 0 0', padding: 0 }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3.2vw,2.3rem)', fontWeight: 550, lineHeight: 1.25, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
              &ldquo;DeadlineMate genuinely saved my semester. I finally knew what mattered each day instead of opening five apps and guessing.&rdquo;
            </p>
          </blockquote>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 28 }}>
            <Avatar a="A" />
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>Aisha R.</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Psychology, 3rd year · University of Leeds</p>
            </div>
          </div>
        </Reveal>

        <div className="dm-quotes" style={{ marginTop: 64, maxWidth: '58rem', marginLeft: 'auto', marginRight: 'auto' }}>
          {side.map(([q, b, n, r, a], i) => (
            <Reveal key={n} delay={i * 0.08} style={{ display: 'flex', flexDirection: 'column' }}>
            <Card hover padding="xl" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{q}</p>
              <p style={{ margin: '10px 0 0', flex: 1, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--ink-muted)' }}>{b}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
                <Avatar a={a} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>{n}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{r}</p>
                </div>
              </div>
            </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
