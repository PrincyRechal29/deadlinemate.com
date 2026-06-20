import { Bell, BookOpenCheck, CalendarClock, CheckCircle2, LayoutDashboard, LineChart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const nav = [
  ['Dashboard', LayoutDashboard],
  ['Planner', CalendarClock],
  ['Modules', BookOpenCheck],
  ['Analytics', LineChart],
  ['Settings', Settings],
];

const plannerSets = [
  [45, 55, 65, 75, 85],
  [62, 42, 78, 56, 92],
  [38, 70, 52, 88, 64],
];

const alerts = [
  'Research essay needs two focus sessions before Friday.',
  'Statistics quiz moved up — a revision block was added today.',
  'Group presentation is high priority for tomorrow.',
];

const highlights = [
  'Deadline urgency scoring for the week ahead',
  'Focus blocks generated from due dates and exam pressure',
  'Planner, analytics, and reminders in one clean view',
];

export default function ProductDemo() {
  const [liveIndex, setLiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveIndex((current) => (current + 1) % plannerSets.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="product-demo" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="card overflow-hidden p-2 shadow-[var(--shadow-lg)]"
        >
          <div className="grid overflow-hidden rounded-[1rem] border border-slate-100 bg-white lg:grid-cols-[180px_1fr]">
            <aside className="hidden border-r border-slate-100 bg-slate-50/60 p-4 lg:block">
              <div className="rounded-xl bg-white p-3 shadow-[var(--shadow-sm)]">
                <p className="text-sm font-bold text-slate-900">DeadlineMate</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Student workspace</p>
              </div>
              <div className="mt-5 space-y-1">
                {nav.map(([label, Icon], index) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      index === 0 ? 'bg-indigo-600 text-white' : 'text-slate-500'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </div>
                ))}
              </div>
            </aside>

            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-slate-900">Weekly planner</p>
                  <span className="text-xs text-slate-400">Focus load</span>
                </div>
                <div className="mt-5 grid grid-cols-5 gap-2.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div className="flex h-24 w-full items-end rounded-lg bg-slate-50 p-1.5">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${plannerSets[liveIndex][index]}%` }}
                          transition={{ duration: 0.7, delay: index * 0.06 }}
                          className="w-full rounded-md bg-gradient-to-t from-indigo-600 to-violet-400"
                        />
                      </div>
                      <p className="text-[11px] font-medium text-slate-400">{day}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
                <Bell className="mt-0.5 shrink-0 text-rose-500" size={18} />
                <div>
                  <p className="text-sm font-bold text-rose-900">Urgency alert</p>
                  <p className="mt-1 text-sm leading-6 text-rose-700">{alerts[liveIndex]}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="eyebrow">Product tour</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Your semester, finally under control.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Plan deadlines, exams, modules, and focus sessions in one calm dashboard built for modern
            university life.
          </p>
          <div className="mt-8 space-y-3">
            {highlights.map((text) => (
              <div key={text} className="card flex items-center gap-3 p-4">
                <CheckCircle2 className="shrink-0 text-emerald-500" size={20} />
                <span className="text-sm font-medium text-slate-800">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
