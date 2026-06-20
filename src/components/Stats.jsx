import React from 'react';

const stats = [
  ['10,000+', 'deadlines tracked', 'every term across our student community'],
  ['93%', 'submitted on time', 'up from 71% before students started using DeadlineMate'],
  ['5 hrs', 'saved each week', 'less time planning, more time actually studying'],
  ['40+', 'universities', 'students relying on DeadlineMate worldwide'],
];

export default function Stats() {
  return (
    <section style={{ padding: '28px 0 80px' }}>
      <div className="dm-wrap">
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', padding: 'clamp(32px,5vw,56px)', background: 'linear-gradient(125deg, var(--brand-blue), var(--accent) 48%, var(--accent-2))', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(30rem 16rem at 90% 120%, rgba(181,240,90,0.25), transparent 60%)' }} />
          <div className="dm-stats" style={{ position: 'relative' }}>
            {stats.map(([v, l, d]) => (
              <div key={l}>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'clamp(2rem,3.4vw,3rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>{v}</p>
                <p style={{ margin: '12px 0 0', fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{l}</p>
                <p style={{ margin: '6px 0 0', fontSize: '0.82rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.78)' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
