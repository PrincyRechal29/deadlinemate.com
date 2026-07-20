import React from 'react';
import { Logo } from './ui/Logo.jsx';
import { Icons } from './ui/icons.jsx';
import { SectionHead } from './ui/layout.jsx';

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
    <section id="product" style={{ padding: '104px 0', background: 'var(--page-2)' }}>
      <div className="dm-wrap dm-split">
        <div>
          <SectionHead
            kicker="Product"
            title="Your semester, finally under control."
            sub="Open DeadlineMate and see exactly what to work on — a live planner that reshapes itself as deadlines and exams approach."
          />
          <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {points.map(([t, d]) => (
              <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>
                  <Icons.Check size={14} />
                </span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.96rem', color: 'var(--ink)' }}>{t}</p>
                  <p style={{ margin: '3px 0 0', fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--ink-muted)' }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="dm-demo-inner dm-invert" style={{ display: 'grid', gridTemplateColumns: '160px 1fr', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--panel-solid)', boxShadow: 'var(--shadow-lg)' }}>
            <aside className="dm-demo-aside" style={{ borderRight: '1px solid var(--line)', background: 'var(--panel)', padding: 14 }}>
              <Logo size={24} compact />
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {nav.map(([l, Icon], idx) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 550, color: idx === 0 ? 'var(--ink)' : 'var(--ink-faint)', background: idx === 0 ? 'var(--panel-2)' : 'transparent' }}>
                    <Icon size={15} /> {l}
                  </div>
                ))}
              </div>
            </aside>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 16, borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: 'var(--ink)' }}>Weekly planner</p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>Focus load</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginTop: 16 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ height: 92, width: '100%', display: 'flex', alignItems: 'flex-end', borderRadius: 'var(--radius-sm)', background: 'var(--page-2)', padding: 4 }}>
                        <div style={{ width: '100%', height: `${sets[i][idx]}%`, borderRadius: 5, background: 'var(--accent)', opacity: 0.25 + (sets[i][idx] / 100) * 0.75, transition: 'height 0.7s var(--ease-out), opacity 0.7s var(--ease-out)' }} />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--ink-faint)' }}>{day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, padding: 15, borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', background: 'var(--page-2)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--urg-critical)', flexShrink: 0, marginTop: 6 }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>Urgency alert</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--ink-muted)' }}>{alerts[i]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
