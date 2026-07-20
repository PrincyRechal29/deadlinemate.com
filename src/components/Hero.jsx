import React from 'react';
import { Button } from './ui/Button.jsx';
import { Badge } from './ui/Badge.jsx';
import { StatTile } from './ui/StatTile.jsx';
import { DeadlineRow } from './ui/DeadlineRow.jsx';
import { Icons } from './ui/icons.jsx';
import { Halo } from './ui/decor.jsx';
import { Logo } from './ui/Logo.jsx';

const pad2 = (n) => String(Math.max(0, n)).padStart(2, '0');

/** Live countdown to the next 17:00 — quiet proof that the product is about time. */
function useCountdown() {
  const target = React.useRef(null);
  if (target.current === null) {
    const t = new Date();
    t.setHours(17, 0, 0, 0);
    if (t.getTime() <= Date.now()) t.setDate(t.getDate() + 1);
    target.current = t.getTime();
  }
  const [ms, setMs] = React.useState(() => target.current - Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setMs(target.current - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${pad2(Math.floor(total / 3600))}:${pad2(Math.floor((total % 3600) / 60))}:${pad2(total % 60)}`;
}

const board = [
  ['Group presentation', 'Marketing', 'Due today · 17:00', 'critical'],
  ['Research essay', 'Sociology', 'Due tomorrow', 'high'],
  ['Economics quiz', 'Economics', 'Due in 3 days', 'medium'],
];

/** Small bobbing notification chip that floats around the hero dashboard. */
function HeroChip({ icon, tone, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px 8px 9px', borderRadius: 'var(--radius-pill)', background: '#fff', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)', whiteSpace: 'nowrap' }}>
      <span style={{ display: 'grid', placeItems: 'center', width: 24, height: 24, borderRadius: '50%', background: tone, color: '#fff', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
    </span>
  );
}

export default function Hero({ onCta }) {
  const countdown = useCountdown();
  return (
    <section style={{ position: 'relative', padding: '104px 0 110px', overflow: 'hidden' }}>
      <Halo top="14rem" />
      <div className="dm-wrap" style={{ position: 'relative', textAlign: 'center' }}>
        <div className="dm-rise">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '7px 15px', borderRadius: 'var(--radius-pill)', background: 'var(--accent-soft)', border: '1px solid rgba(166, 124, 31, 0.32)', fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-soft)' }}>
            <span className="dm-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            Next deadline in
            <span className="mono" style={{ fontWeight: 550, color: 'var(--ink)' }}>{countdown}</span>
          </span>
          <h1 style={{ margin: '30px auto 0', maxWidth: '17ch', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.7rem,6.4vw,4.9rem)', fontWeight: 620, lineHeight: 1.02, letterSpacing: '-0.045em', color: 'var(--ink)' }}>
            The calmest way to never miss a deadline.
          </h1>
          <p style={{ margin: '26px auto 0', maxWidth: '36rem', fontSize: '1.14rem', lineHeight: 1.65, color: 'var(--ink-muted)' }}>
            DeadlineMate turns assignments, exams, and modules into one prioritized plan — with reminders that reach you a week, a day, and an hour before anything is due.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 34, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" iconRight={<Icons.ArrowRight size={16} />} onClick={onCta}>Start free</Button>
            <Button variant="secondary" size="lg" as="a" href="#product">See how it works</Button>
          </div>
          <p style={{ margin: '18px 0 0', fontSize: '0.84rem', color: 'var(--ink-faint)' }}>Free forever plan · No credit card needed</p>
        </div>

        {/* Floating dashboard with bobbing satellite chips */}
        <div className="dm-rise" style={{ animationDelay: '0.15s', position: 'relative', maxWidth: '58rem', margin: '72px auto 0' }}>
          <div className="dm-hero-chip dm-float" style={{ position: 'absolute', top: -24, left: -30, zIndex: 3 }}>
            <HeroChip icon={<Icons.Check size={14} />} tone="var(--urg-low)" label="Essay submitted" />
          </div>
          <div className="dm-hero-chip dm-float-alt" style={{ position: 'absolute', top: 48, right: -42, zIndex: 3 }}>
            <HeroChip icon={<Icons.Bell size={14} />} tone="var(--accent)" label="Reminder sent" />
          </div>
          <div className="dm-hero-chip dm-float-alt" style={{ position: 'absolute', bottom: -20, left: 34, zIndex: 3 }}>
            <HeroChip icon={<Icons.CalendarClock size={14} />} tone="var(--urg-high)" label="3 due this week" />
          </div>
          <div style={{ borderRadius: 'var(--radius-2xl)', background: 'var(--panel-solid)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', textAlign: 'left' }} className="dm-invert">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 22px', borderBottom: '1px solid var(--line)' }}>
              <Logo size={26} compact />
              <div style={{ display: 'flex', gap: 4 }}>
                {['Today', 'Planner', 'Modules'].map((tab, i) => (
                  <span key={tab} style={{ padding: '6px 13px', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 550, color: i === 0 ? 'var(--ink)' : 'var(--ink-faint)', background: i === 0 ? 'var(--panel-2)' : 'transparent' }}>{tab}</span>
                ))}
              </div>
              <Badge tone="success" dot>On track</Badge>
            </div>
            <div className="dm-mock-cols" style={{ padding: 22 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>Today&rsquo;s plan</p>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--ink-faint)' }}>Sorted by urgency</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {board.map(([t, c, d, u]) => (
                    <DeadlineRow key={t} title={t} course={c} due={d} urgency={u} trailing={<Badge tone={u} size="sm">{u[0].toUpperCase() + u.slice(1)}</Badge>} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <StatTile value="18" label="Deadlines this term" />
                <StatTile value="7.5 hrs" label="Focus time planned" />
                <StatTile value="92%" label="Submitted on time" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
