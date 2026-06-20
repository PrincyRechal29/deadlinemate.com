import React from 'react';
import { Logo } from './ui/Logo.jsx';
import { Icons } from './ui/icons.jsx';
import { Kicker } from './ui/layout.jsx';

export default function ProductDemo() {
  const sets = [[45, 55, 68, 78, 88], [62, 42, 78, 56, 92], [38, 72, 52, 90, 64]];
  const alerts = [
    'Research essay needs two focus sessions before Friday.',
    'Statistics quiz moved up — a revision block was added today.',
    'Group presentation is high priority for tomorrow morning.',
  ];
  const [i, setI] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % sets.length), 4200); return () => clearInterval(t); }, []);
  const nav = [['Dashboard', Icons.LayoutDashboard], ['Planner', Icons.CalendarClock], ['Modules', Icons.BookOpen], ['Analytics', Icons.BarChart], ['Settings', Icons.Settings]];
  const points = [
    ['Urgency scoring', 'Each deadline is ranked by due date, workload, and weight.'],
    ['Auto-built focus blocks', 'Study time is scheduled from real exam and deadline pressure.'],
    ['One calm view', 'Planner, analytics, and reminders live in a single place.'],
  ];
  return (
    <section id="product" style={{ position: 'relative', padding: '92px 0', background: 'var(--ink)', color: '#fff', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(46rem 24rem at 84% 0%, rgba(99,102,241,0.32), transparent 58%), radial-gradient(40rem 22rem at 0% 100%, rgba(0,184,217,0.2), transparent 55%)' }} />
      <div className="grid-bg-dark" style={{ position: 'absolute', inset: 0 }} />
      <div className="dm-wrap dm-split" style={{ position: 'relative' }}>
        <div>
          <Kicker onDark>Product tour</Kicker>
          <h2 style={{ margin: '18px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.4vw,3rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            Your semester, finally <span className="brand-text">under control.</span>
          </h2>
          <p style={{ margin: '18px 0 0', maxWidth: '32rem', fontSize: '1.08rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.72)' }}>
            Open DeadlineMate and see exactly what to work on — a live planner that reshapes itself as deadlines and exams approach.
          </p>
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {points.map(([t, d]) => (
              <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,0.08)', color: 'var(--brand-lime)', flexShrink: 0 }}><Icons.Check size={16} /></span>
                <div><p style={{ margin: 0, fontWeight: 700, fontSize: '0.98rem' }}>{t}</p><p style={{ margin: '3px 0 0', fontSize: '0.88rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.6)' }}>{d}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', borderRadius: 'var(--radius-2xl)', padding: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '168px 1fr', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)' }} className="dm-demo-inner">
            <aside style={{ borderRight: '1px solid var(--line)', background: 'rgba(248,250,252,0.7)', padding: 14 }} className="dm-demo-aside">
              <Logo size={26} subtitle="" />
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {nav.map(([l, Icon], idx) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 11, fontSize: '0.84rem', fontWeight: 600, color: idx === 0 ? '#fff' : 'var(--ink-muted)', background: idx === 0 ? 'var(--accent)' : 'transparent' }}>
                    <Icon size={16} /> {l}
                  </div>
                ))}
              </div>
            </aside>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 16, borderRadius: 16, border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--ink)' }}>Weekly planner</p>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', color: 'var(--ink-faint)' }}>FOCUS LOAD</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginTop: 18 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ height: 100, width: '100%', display: 'flex', alignItems: 'flex-end', borderRadius: 9, background: 'var(--page)', padding: 5 }}>
                        <div style={{ width: '100%', height: `${sets[i][idx]}%`, borderRadius: 7, background: 'linear-gradient(to top,var(--accent),var(--accent-2))', transition: 'height 0.7s var(--ease-out)' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 500, color: 'var(--ink-faint)' }}>{day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, padding: 16, borderRadius: 16, border: '1px solid var(--urg-critical)', background: 'var(--urg-critical-soft)' }}>
                <Icons.Bell size={18} color="var(--urg-critical)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div><p style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700, color: '#be123c' }}>Urgency alert</p><p style={{ margin: '5px 0 0', fontSize: '0.84rem', lineHeight: 1.6, color: '#9f1239' }}>{alerts[i]}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
