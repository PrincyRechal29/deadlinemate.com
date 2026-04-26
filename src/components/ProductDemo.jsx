import { Bell, BookOpenCheck, CalendarClock, CheckCircle2, Gauge, LayoutDashboard, LineChart, Settings } from 'lucide-react';
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
  'Statistics quiz moved up. Revision block added today.',
  'Group presentation is high priority for tomorrow.',
];

const generatedStates = [
  ['AI plan generated', 'Exam countdown synced', 'Module progress updated'],
  ['Urgency score refreshed', 'Focus block scheduled', 'Reminder queue updated'],
  ['Study streak protected', 'Weekly plan balanced', 'Deadline risk lowered'],
];

export default function ProductDemo() {
  const [liveIndex, setLiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveIndex((current) => (current + 1) % plannerSets.length);
    }, 3900);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="product-demo" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="dashboard-frame rounded-[2rem] border border-white/10 bg-slate-950/90 p-3 text-white shadow-2xl shadow-indigo-300/40"
        >
          <div className="grid overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#080b16] lg:grid-cols-[220px_1fr]">
            <aside className="border-b border-white/10 bg-white/[0.03] p-5 lg:border-b-0 lg:border-r">
              <div className="rounded-2xl bg-white/[0.05] p-4">
                <p className="font-black">DeadlineMate</p>
                <p className="mt-1 text-xs text-slate-500">Student workspace</p>
              </div>
              <div className="mt-6 space-y-2">
                {nav.map(([label, Icon], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold ${
                      index === 0 ? 'bg-white text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                  </motion.div>
                ))}
              </div>
            </aside>

            <div className="grid gap-5 p-5 xl:grid-cols-3">
              <div className="motion-surface rounded-3xl border border-white/10 bg-white/[0.045] p-5 xl:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-black">Weekly planner</p>
                    <p className="text-sm text-slate-500">Your highest-impact study blocks</p>
                  </div>
                  <Gauge className="text-cyan-300" />
                </div>
                <div className="mt-6 grid grid-cols-5 gap-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                    <div key={day} className="rounded-2xl bg-slate-950/75 p-3">
                      <p className="text-xs font-bold text-slate-500">{day}</p>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${plannerSets[liveIndex][index]}%` }}
                        transition={{ duration: 0.8, delay: index * 0.08 }}
                        className="mt-8 min-h-12 rounded-xl bg-gradient-to-t from-cyan-400 to-violet-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-rose-300/20 bg-rose-300/10 p-5">
                <Bell className="text-rose-200" />
                <p className="mt-5 font-black">Urgency alert</p>
                <p className="mt-2 text-sm leading-6 text-rose-100">{alerts[liveIndex]}</p>
              </div>

              {generatedStates[liveIndex].map((item) => (
                <div key={item} className="motion-surface rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                  <CheckCircle2 className="text-emerald-300" />
                  <p className="mt-4 text-sm font-black">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }}>
          <p className="eyebrow">Interactive demo</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">A real academic workflow, not another to-do list.</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            DeadlineMate presents the week like a command center: what is urgent, what to study, and which module needs attention next.
          </p>
          <div className="mt-8 grid gap-4">
            {['Deadline urgency scoring', 'Focus blocks generated from due dates', 'Planner, analytics, and reminders in one view'].map((text) => (
              <div key={text} className="glass-panel flex items-center gap-3 rounded-2xl p-4">
                <CheckCircle2 className="text-emerald-300" size={20} />
                <span className="font-bold text-slate-950">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
