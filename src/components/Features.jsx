import React from 'react';
import { Card } from './ui/Card.jsx';
import { Badge } from './ui/Badge.jsx';
import { Icons } from './ui/icons.jsx';
import { SectionHead } from './ui/layout.jsx';

const IconChip = ({ Icon, tint = 'var(--accent)', bg = 'var(--accent-soft)' }) => (
  <span style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 13, background: bg, color: tint, flexShrink: 0 }}>
    <Icon size={21} />
  </span>
);

const Title = ({ children }) => <h3 style={{ margin: '16px 0 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>{children}</h3>;
const Desc = ({ children }) => <p style={{ margin: '8px 0 0', fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--ink-muted)' }}>{children}</p>;

export default function Features() {
  const small = [
    ['Exam countdown', 'Live timers for every exam, so revision never sneaks up on you.', Icons.Timer, 'var(--urg-high)', 'var(--urg-high-soft)'],
    ['Module hub', 'Lectures, projects, and notes grouped cleanly by course.', Icons.Layers, 'var(--brand-cyan)', 'rgba(0,184,217,0.1)'],
    ['Focus sessions', 'Due dates become realistic, bookable study blocks.', Icons.BookOpen, 'var(--accent-2)', 'rgba(124,58,237,0.1)'],
    ['Progress insights', 'See which modules need attention before they slip.', Icons.BarChart, 'var(--urg-low)', 'var(--urg-low-soft)'],
  ];
  return (
    <section id="features" style={{ padding: '80px 0' }}>
      <div className="dm-wrap">
        <SectionHead
          kicker="Features"
          title="One workspace for the"
          accent="whole academic week."
          sub="DeadlineMate replaces five half-used apps with a single system that always knows what is due — and what to start next."
        />
        <div className="dm-bento" style={{ marginTop: 44 }}>
          {/* Flagship — deadline radar (2x2) */}
          <Card hover padding="lg" className="b-w2 b-h2" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <IconChip Icon={Icons.Clock} />
              <Badge tone="critical" dot size="sm">Live</Badge>
            </div>
            <Title>Deadline radar</Title>
            <Desc>Every assignment is scored by due date, workload, and weight — then ranked so the most urgent work rises to the top automatically.</Desc>
            <div style={{ marginTop: 'auto', paddingTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Group presentation', 'Today · 17:00', 'critical', '#be123c', 'var(--urg-critical-soft)', 'var(--urg-critical)'],
                ['Research essay', 'Tomorrow', 'high', '#c2410c', 'var(--urg-high-soft)', 'var(--urg-high)'],
                ['Economics quiz', 'In 3 days', 'medium', '#b45309', 'var(--urg-medium-soft)', 'var(--urg-medium)']].map(([t, d, _u, c, bg, dot]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 12, background: bg, border: `1px solid ${dot}22` }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink)' }}>{t}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: c }}>{d}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Smart reminders (2x1) */}
          <Card hover padding="lg" className="b-w2" style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <IconChip Icon={Icons.Bell} />
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: '2px 0 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>Reminders that actually reach you</h3>
              <Desc>Email, push, and SMS alerts a week, a day, and an hour before each due date — across every device.</Desc>
              <div style={{ display: 'flex', gap: 7, marginTop: 14, flexWrap: 'wrap' }}>
                {['1 week', '1 day', '1 hour'].map((t) => (
                  <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '5px 10px', borderRadius: 999 }}>T‑{t}</span>
                ))}
              </div>
            </div>
          </Card>

          {/* Two small under reminders */}
          {small.slice(0, 2).map(([t, d, Icon, tint, bg]) => (
            <Card key={t} hover padding="lg">
              <IconChip Icon={Icon} tint={tint} bg={bg} />
              <Title>{t}</Title>
              <Desc>{d}</Desc>
            </Card>
          ))}

          {/* LMS import (2x1) */}
          <Card hover padding="lg" className="b-w2" style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <IconChip Icon={Icons.Download} tint="var(--brand-blue)" bg="rgba(40,76,255,0.1)" />
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: '2px 0 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>Import your whole semester</h3>
              <Desc>Paste one calendar link and every deadline syncs — then stays up to date on its own.</Desc>
              <div style={{ display: 'flex', gap: 7, marginTop: 14, flexWrap: 'wrap' }}>
                {['Canvas', 'Moodle', 'Blackboard', 'Google Classroom'].map((t) => (
                  <span key={t} style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--ink-soft)', background: 'var(--page-tint)', padding: '5px 11px', borderRadius: 999 }}>{t}</span>
                ))}
              </div>
            </div>
          </Card>

          {/* Two more small */}
          {small.slice(2).map(([t, d, Icon, tint, bg]) => (
            <Card key={t} hover padding="lg">
              <IconChip Icon={Icon} tint={tint} bg={bg} />
              <Title>{t}</Title>
              <Desc>{d}</Desc>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
