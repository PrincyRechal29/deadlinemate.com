import React from 'react';
import { Icons } from './ui/icons.jsx';
import { SectionHead } from './ui/layout.jsx';
import { Reveal } from './ui/motion.jsx';

const faqs = [
  ['Is DeadlineMate only for university students?', 'It is built around university workflows, but any student managing modules, exams, and coursework will feel at home.'],
  ['How is this different from a calendar?', 'Calendars store dates. DeadlineMate turns academic dates into priorities, study blocks, reminders, and progress — it tells you what to do, not just when things are due.'],
  ['Can I import deadlines from my university?', 'Yes. Paste your LMS calendar link (Canvas, Moodle, Blackboard, or Google Classroom) and your deadlines sync automatically — and stay in sync.'],
  ['Will it work on my phone?', 'DeadlineMate is mobile-first, so you can check your plan in seconds between lectures, with push reminders on every device.'],
  ['What do I get for free?', 'Unlimited assignments, email reminders, and one calendar import — free forever, no credit card needed.'],
];

export default function FAQ() {
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq" style={{ padding: '0 0 104px' }}>
      <div className="dm-wrap-narrow">
        <SectionHead align="center" kicker="FAQ" title="Questions, answered." />
        <Reveal style={{ marginTop: 48, borderBottom: '1px solid var(--line)' }}>
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} style={{ borderTop: '1px solid var(--line)' }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '22px 2px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: '1.02rem', fontWeight: 550, color: 'var(--ink)' }}>{q}</span>
                  <span style={{ display: 'grid', placeItems: 'center', width: 26, height: 26, flexShrink: 0, color: 'var(--ink-muted)', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.22s var(--ease-out)' }}>
                    <Icons.Plus size={17} />
                  </span>
                </button>
                {isOpen && <p style={{ margin: 0, padding: '0 40px 24px 2px', lineHeight: 1.7, color: 'var(--ink-muted)' }}>{a}</p>}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
