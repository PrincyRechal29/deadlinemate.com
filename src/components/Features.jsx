import React from 'react';
import { Card } from './ui/Card.jsx';
import { Badge } from './ui/Badge.jsx';
import { Icons } from './ui/icons.jsx';
import { SectionHead } from './ui/layout.jsx';
import { Reveal } from './ui/motion.jsx';

const URG_META = { critical: 'var(--tone-critical-text)', high: 'var(--tone-high-text)', medium: 'var(--tone-medium-text)' };

export default function Features() {
  const list = [
    ['Exam countdown', 'Live timers for every exam, so revision never sneaks up on you.', Icons.Timer],
    ['Module hub', 'Lectures, projects, and notes grouped cleanly by course.', Icons.Layers],
    ['Focus sessions', 'Due dates become realistic, bookable study blocks.', Icons.BookOpen],
    ['Progress insights', 'See which modules need attention before they slip.', Icons.BarChart],
  ];
  const radar = [
    ['Group presentation', 'Today · 17:00', 'critical'],
    ['Research essay', 'Tomorrow', 'high'],
    ['Economics quiz', 'In 3 days', 'medium'],
  ];
  return (
    <section id="features" style={{ padding: '104px 0' }}>
      <div className="dm-wrap">
        <SectionHead
          kicker="Features"
          title="One workspace for the whole academic week."
          sub="DeadlineMate replaces five half-used apps with a single system that always knows what is due — and what to start next."
        />

        {/* Two quiet showcase panels */}
        <div className="dm-showcase" style={{ marginTop: 56 }}>
          <Reveal>
          <Card grey padding="xl" style={{ height: '100%', boxSizing: 'border-box' }}>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)' }}>Deadline radar</p>
            <p style={{ margin: '8px 0 0', maxWidth: '26rem', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--ink-muted)' }}>
              Every assignment is scored by due date, workload, and weight — the most urgent work rises to the top on its own.
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {radar.map(([t, d, u]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 15px', borderRadius: 'var(--radius-md)', background: 'var(--panel)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: `var(--urg-${u})`, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 550, color: 'var(--ink)' }}>{t}</span>
                  <span style={{ fontSize: '0.76rem', fontWeight: 550, color: URG_META[u] }}>{d}</span>
                </div>
              ))}
            </div>
          </Card>
          </Reveal>

          <Reveal delay={0.08}>
          <Card grey padding="xl" style={{ height: '100%', boxSizing: 'border-box' }}>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)' }}>Reminders that actually reach you</p>
            <p style={{ margin: '8px 0 0', maxWidth: '26rem', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--ink-muted)' }}>
              Email, push, and SMS — a week, a day, and an hour before each due date, on every device.
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['A week before', 'Research essay · plan two focus sessions', false],
                ['A day before', 'Research essay · draft due tomorrow', false],
                ['An hour before', 'Research essay · final check and submit', true]].map(([when, what, active]) => (
                <div key={when} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px', borderRadius: 'var(--radius-md)', background: 'var(--panel)', border: `1px solid ${active ? 'var(--accent)' : 'var(--line)'}`, boxShadow: 'var(--shadow-sm)' }}>
                  <Icons.Bell size={15} color={active ? 'var(--accent)' : 'var(--ink-faint)'} style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>{when}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: 'var(--ink-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{what}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          </Reveal>
        </div>

        {/* Hairline feature list */}
        <div className="dm-feature-list" style={{ marginTop: 24 }}>
          {list.map(([t, d, Icon], i) => (
            <Reveal key={t} delay={i * 0.06} style={{ padding: '26px 0', borderTop: '1px solid var(--line)' }}>
              <Icon size={19} color="var(--ink)" />
              <h3 style={{ margin: '14px 0 0', fontSize: '0.98rem', fontWeight: 600, color: 'var(--ink)' }}>{t}</h3>
              <p style={{ margin: '7px 0 0', fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--ink-muted)' }}>{d}</p>
            </Reveal>
          ))}
        </div>

        {/* LMS import strip */}
        <Reveal style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', padding: '22px 26px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--line)' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>Import your whole semester</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: 'var(--ink-muted)' }}>Paste one calendar link and every deadline syncs — then stays up to date on its own.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Canvas', 'Moodle', 'Blackboard', 'Google Classroom'].map((t) => (
              <Badge key={t} tone="neutral">{t}</Badge>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
