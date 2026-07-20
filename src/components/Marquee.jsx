import React from 'react';

const schools = [
  'Manchester', 'King’s College London', 'Leeds', 'UCL', 'Bristol',
  'Edinburgh', 'Warwick', 'Durham', 'Birmingham', 'Glasgow',
];

/**
 * Trust row as an infinite marquee — two identical halves slide by -50% on a
 * linear loop; pauses on hover; the global reduced-motion rule freezes it.
 */
export default function Marquee() {
  const half = (key) => (
    <div key={key} aria-hidden={key === 'b'} style={{ display: 'flex', flexShrink: 0 }}>
      {schools.map((s) => (
        <span key={s} style={{ padding: '0 26px', fontSize: '0.95rem', fontWeight: 550, letterSpacing: '-0.01em', color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>{s}</span>
      ))}
    </div>
  );
  return (
    <section style={{ padding: '0 0 96px' }}>
      <div className="dm-wrap" style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 22px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-faint)' }}>
          Keeping students on track at 40+ universities
        </p>
      </div>
      <div className="dm-marquee">
        <div className="dm-marquee-track">
          {half('a')}
          {half('b')}
        </div>
      </div>
    </section>
  );
}
