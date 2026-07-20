import React from 'react';
import { SectionHead } from './ui/layout.jsx';
import { Reveal } from './ui/motion.jsx';

const steps = [
  ['1', 'Add your deadlines', 'Type them in, or import a whole semester from Canvas, Moodle, or Google Classroom in one click.'],
  ['2', 'See what matters today', 'DeadlineMate ranks everything by due date, workload, and weight — so you always know what to start.'],
  ['3', 'Get reminded in time', 'Alerts arrive a week, a day, and an hour before each deadline. Nothing quietly slips past you.'],
  ['4', 'Stay ahead all term', 'Build streaks, track progress, and watch the stress drop as the semester stays under control.'],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '104px 0' }}>
      <div className="dm-wrap">
        <SectionHead kicker="How it works" title="From deadline chaos to calm, in four steps." />
        <div className="dm-steps" style={{ marginTop: 56 }}>
          {steps.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 0.07} style={{ paddingTop: 22, borderTop: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--accent)' }}>{n}</span>
              <h3 style={{ margin: '12px 0 0', fontSize: '1.02rem', fontWeight: 600, color: 'var(--ink)' }}>{t}</h3>
              <p style={{ margin: '9px 0 0', fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--ink-muted)' }}>{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
