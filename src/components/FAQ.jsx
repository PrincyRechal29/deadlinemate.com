import React from 'react';
import { Card } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Icons } from './ui/icons.jsx';
import { Kicker } from './ui/layout.jsx';

const faqs = [
  ['Is DeadlineMate only for university students?', 'It is built around university workflows, but any student managing modules, exams, and coursework will feel at home.'],
  ['How is this different from a calendar?', 'Calendars store dates. DeadlineMate turns academic dates into priorities, study blocks, reminders, and progress — it tells you what to do, not just when things are due.'],
  ['Can I import deadlines from my university?', 'Yes. Paste your LMS calendar link (Canvas, Moodle, Blackboard, or Google Classroom) and your deadlines sync automatically — and stay in sync.'],
  ['Will it work on my phone?', 'DeadlineMate is mobile-first, so you can check your plan in seconds between lectures, with push reminders on every device.'],
  ['What do I get for free?', 'Unlimited assignments, email reminders, and one calendar import — free forever, no credit card needed.'],
];

export default function FAQ({ onCta }) {
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq" style={{ padding: '80px 0', background: 'var(--page-tint)' }}>
      <div className="dm-wrap dm-faq">
        <div className="dm-faq-head">
          <Kicker>FAQ</Kicker>
          <h2 style={{ margin: '18px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.4vw,2.8rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink)', lineHeight: 1.1 }}>
            Questions,<br /><span className="gradient-text">answered.</span>
          </h2>
          <p style={{ margin: '16px 0 0', maxWidth: '22rem', fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>
            Still unsure? Reach out and a real student-support human will get back to you.
          </p>
          <div style={{ marginTop: 22 }}>
            <Button variant="secondary" onClick={onCta} iconRight={<Icons.ArrowRight size={15} />}>Start free</Button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <Card key={q} padding="none" style={{ overflow: 'hidden' }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '20px 22px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--ink)' }}>{q}</span>
                  <span style={{ display: 'grid', placeItems: 'center', width: 32, height: 32, flexShrink: 0, borderRadius: '50%', background: isOpen ? 'var(--accent)' : 'var(--page-tint)', color: isOpen ? '#fff' : 'var(--ink-soft)', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.24s var(--ease-out), background 0.24s var(--ease-out)' }}><Icons.Plus size={17} /></span>
                </button>
                {isOpen && <p style={{ margin: 0, padding: '0 22px 22px', lineHeight: 1.7, color: 'var(--ink-soft)' }}>{a}</p>}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
