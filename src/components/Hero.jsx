import React from 'react';
import { Button } from './ui/Button.jsx';
import { Card } from './ui/Card.jsx';
import { Badge } from './ui/Badge.jsx';
import { StatTile } from './ui/StatTile.jsx';
import { DeadlineRow } from './ui/DeadlineRow.jsx';
import { Icons } from './ui/icons.jsx';

const heroSets = [
  [['Research essay', 'Sociology', 'Due tomorrow · 9:00', 'high'], ['Group presentation', 'Marketing', 'Due Friday', 'critical'], ['Economics quiz', 'Economics', 'Due in 3 days', 'medium']],
  [['Lab report', 'Chemistry', 'Due today · 17:00', 'critical'], ['Reading notes', 'History', 'Due in 2 days', 'medium'], ['Stats worksheet', 'Statistics', 'Due Monday', 'low']],
];

export default function Hero({ onCta }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % heroSets.length), 4500); return () => clearInterval(t); }, []);
  const set = heroSets[i];
  return (
    <section style={{ position: 'relative', padding: '64px 0 88px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: -2, background: 'radial-gradient(48rem 30rem at 78% -6rem, rgba(79,70,229,0.16), transparent 60%), radial-gradient(40rem 26rem at 8% 4%, rgba(0,184,217,0.10), transparent 58%)' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: -1 }} />
      <div className="dm-wrap dm-hero">
        <div className="dm-rise">
          <a href="#product" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, maxWidth: '100%', padding: '6px 6px 6px 14px', borderRadius: 999, border: '1px solid var(--line)', background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--urg-low)', boxShadow: '0 0 0 3px var(--urg-low-soft)' }} /> New</span>
            <span style={{ color: 'var(--ink-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Canvas &amp; Moodle sync</span>
            <span style={{ display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', flexShrink: 0 }}><Icons.ArrowRight size={13} /></span>
          </a>
          <h1 style={{ margin: '24px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem,5.6vw,4.1rem)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
            Every deadline, ranked by <span className="gradient-text">what to do today.</span>
          </h1>
          <p style={{ margin: '22px 0 0', maxWidth: '34rem', fontSize: '1.16rem', lineHeight: 1.65, color: 'var(--ink-soft)' }}>
            DeadlineMate turns your assignments, exams, and modules into one calm, prioritized plan — with reminders that reach you a week, a day, and an hour before anything is due.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" iconRight={<Icons.ArrowRight size={17} />} onClick={onCta}>Start free</Button>
            <Button variant="secondary" size="lg" as="a" href="#product" iconLeft={<Icons.Zap size={16} color="var(--accent)" />}>See it in action</Button>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 22, flexWrap: 'wrap', fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icons.CheckCircle size={16} color="var(--urg-low)" /> Free forever plan</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icons.CheckCircle size={16} color="var(--urg-low)" /> No credit card needed</span>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 34, paddingTop: 26, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
            {[['10K+', 'deadlines tracked'], ['40+', 'universities'], ['4.9★', 'student rating']].map(([v, l]) => (
              <div key={l}>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.03em' }}>{v}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: 'var(--ink-muted)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div className="dm-hero-float" style={{ position: 'absolute', left: -18, top: 40, zIndex: 5, display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)', animation: 'dmfloat 6s ease-in-out infinite' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)' }}><Icons.Bell size={17} /></span>
            <div><p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)' }}>Reminder sent</p><p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'var(--ink-muted)' }}>Essay due in 24h</p></div>
          </div>
          <div className="dm-hero-float" style={{ position: 'absolute', right: -14, bottom: 28, zIndex: 5, display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderRadius: 14, background: 'var(--ink)', color: '#fff', boxShadow: 'var(--shadow-lg)', animation: 'dmfloat2 7s ease-in-out infinite' }}>
            <Icons.Flame size={18} color="var(--urg-high)" />
            <div><p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700 }}>14-day streak</p><p style={{ margin: '1px 0 0', fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>Keep it going</p></div>
          </div>

          <Card padding="sm" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ borderRadius: 16, background: 'linear-gradient(180deg,#f8fafc,#fff)', padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>Week 7 · 4 modules</p>
                  <p style={{ margin: '5px 0 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>Today&rsquo;s plan</p>
                </div>
                <Badge tone="success" dot>On track</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
                <StatTile icon={<Icons.Calendar size={16} />} value="18" label="Deadlines" />
                <StatTile icon={<Icons.Clock size={16} />} value="7.5" label="Focus hrs" accent="var(--brand-cyan)" />
                <StatTile icon={<Icons.TrendingUp size={16} />} value="92%" label="On time" accent="var(--urg-low)" />
              </div>
              <div style={{ padding: 16, borderRadius: 16, border: '1px solid var(--line)', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <p style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700, color: 'var(--ink)' }}>Up next</p>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--ink-faint)' }}>SORTED BY URGENCY</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {set.map(([t, c, d, u]) => (
                    <DeadlineRow key={t} title={t} course={c} due={d} urgency={u} trailing={<Badge tone={u} dot size="sm">{u[0].toUpperCase() + u.slice(1)}</Badge>} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
