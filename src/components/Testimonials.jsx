import React from 'react';
import { Card } from './ui/Card.jsx';
import { Icons } from './ui/icons.jsx';
import { SectionHead } from './ui/layout.jsx';

const Avatar = ({ a, dark }) => (
  <span style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.14)' : 'var(--grad-accent)', color: '#fff', fontWeight: 700, flexShrink: 0 }}>{a}</span>
);
const Stars = () => (
  <div style={{ display: 'flex', gap: 2 }}>{Array.from({ length: 5 }).map((_, i) => <Icons.Star key={i} size={15} color="var(--urg-medium)" style={{ fill: 'var(--urg-medium)' }} />)}</div>
);

export default function Testimonials() {
  const side = [
    ['It made deadlines feel manageable.', 'The urgency view and study blocks helped me work earlier instead of rushing at midnight.', 'Daniel', 'Engineering, 2nd year', 'D'],
    ['Built for actual university life.', 'Structured enough for modules and exams, but clean enough to open every single morning.', 'Maya', 'Business, final year', 'M'],
  ];
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="dm-wrap">
        <SectionHead kicker="Loved by students" title="A calmer semester starts with a" accent="better system." />
        <div className="dm-split" style={{ marginTop: 44, alignItems: 'stretch' }}>
          <Card dark padding="xl" style={{ display: 'flex', flexDirection: 'column' }}>
            <Stars />
            <p style={{ margin: '20px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,2.6vw,2rem)', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em', color: '#fff' }}>
              &ldquo;DeadlineMate genuinely saved my semester. I finally knew what mattered each day instead of opening five apps and guessing.&rdquo;
            </p>
            <p style={{ margin: '18px 0 0', fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', flex: 1 }}>
              I went from missing two or three deadlines a term to handing everything in early. The reminders alone are worth it.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 28 }}>
              <Avatar a="A" dark />
              <div><p style={{ margin: 0, fontWeight: 700, color: '#fff' }}>Aisha R.</p><p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>Psychology, 3rd year · University of Leeds</p></div>
            </div>
          </Card>
          <div style={{ display: 'grid', gap: 18 }}>
            {side.map(([q, b, n, r, a]) => (
              <Card key={n} hover padding="lg" style={{ display: 'flex', flexDirection: 'column' }}>
                <Stars />
                <p style={{ margin: '14px 0 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>{q}</p>
                <p style={{ margin: '10px 0 0', flex: 1, fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--ink-soft)' }}>{b}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                  <Avatar a={a} />
                  <div><p style={{ margin: 0, fontWeight: 700, color: 'var(--ink)' }}>{n}</p><p style={{ margin: '2px 0 0', fontSize: '0.83rem', color: 'var(--ink-muted)' }}>{r}</p></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
