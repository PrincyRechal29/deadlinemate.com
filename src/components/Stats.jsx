import React from 'react';
import { Reveal, CountUp } from './ui/motion.jsx';

const stats = [
  ['10,000+', 'deadlines tracked every term'],
  ['93%', 'of work submitted on time'],
  ['5 hrs', 'saved each week on planning'],
  ['40+', 'universities worldwide'],
];

/** Quiet numbers between hairlines — they count up as they scroll into view. */
export default function Stats() {
  return (
    <section style={{ padding: '0 0 104px' }}>
      <div className="dm-wrap">
        <div className="dm-stats" style={{ padding: '48px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          {stats.map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.06}>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(2.1rem,3.6vw,3rem)', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--ink)', lineHeight: 1 }}>
                <CountUp value={v} />
              </p>
              <p style={{ margin: '10px 0 0', fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--ink-muted)' }}>{l}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
