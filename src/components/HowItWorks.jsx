import React from 'react';
import { Icons } from './ui/icons.jsx';
import { SectionHead } from './ui/layout.jsx';

const steps = [
  ['01', 'Add your deadlines', 'Type them in, or import a whole semester from Canvas, Moodle, or Google Classroom in one click.', Icons.Download],
  ['02', 'See what matters today', 'DeadlineMate ranks everything by due date, workload, and weight — so you always know what to start.', Icons.TrendingUp],
  ['03', 'Get reminded in time', 'Alerts arrive a week, a day, and an hour before each deadline. Nothing quietly slips past you.', Icons.Bell],
  ['04', 'Stay ahead all term', 'Build streaks, track progress, and watch the stress drop as the semester stays under control.', Icons.Flame],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '80px 0', background: 'var(--page-tint)' }}>
      <div className="dm-wrap">
        <SectionHead kicker="How it works" title="From deadline chaos to" accent="calm, in four steps." />
        <div className="dm-steps" style={{ marginTop: 48 }}>
          {steps.map(([n, t, d, Icon], idx) => (
            <div key={n} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 46, height: 46, borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--accent)', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                  <Icon size={20} />
                </span>
                <span aria-hidden style={{ flex: 1, height: 2, borderRadius: 2, background: idx === steps.length - 1 ? 'transparent' : 'repeating-linear-gradient(90deg, var(--line-strong) 0 6px, transparent 6px 12px)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink-faint)' }}>{n}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>{t}</h3>
              <p style={{ margin: '10px 0 0', fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--ink-muted)' }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
