import React from 'react';

const schools = [
  'University of Manchester', 'King’s College London', 'University of Leeds', 'UCL', 'University of Bristol',
  'University of Edinburgh', 'University of Warwick', 'Durham University', 'University of Birmingham', 'University of Glasgow',
];

export default function Marquee() {
  const row = [...schools, ...schools];
  return (
    <section style={{ padding: '10px 0 44px' }}>
      <div className="dm-wrap">
        <p style={{ textAlign: 'center', margin: '0 0 22px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
          Keeping students on track at
        </p>
      </div>
      <div className="dm-marquee">
        <div className="dm-marquee-track">
          {row.map((s, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink-faint)' }}>
              {s}
              <span aria-hidden style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--line-strong)' }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
