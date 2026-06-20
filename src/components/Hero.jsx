import { ArrowRight, Bell, CalendarDays, CheckCircle2, Clock3, Flame, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const assignmentSets = [
  [
    ['Research essay', 'Due tomorrow', 'high'],
    ['Economics quiz', 'Due in 3 days', 'medium'],
    ['Group presentation', 'Due Friday', 'high'],
  ],
  [
    ['Lab report', 'Due today', 'critical'],
    ['Reading notes', 'Due in 2 days', 'medium'],
    ['Stats worksheet', 'Due Monday', 'low'],
  ],
];

const urgencyStyles = {
  critical: 'bg-rose-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-400',
  low: 'bg-emerald-500',
};

const statSets = [
  [
    [CalendarDays, 'Deadlines', '18'],
    [Clock3, 'Focus hrs', '7.5'],
    [Flame, 'Day streak', '14'],
  ],
  [
    [CalendarDays, 'Deadlines', '21'],
    [Clock3, 'Focus hrs', '9.0'],
    [Flame, 'Day streak', '15'],
  ],
];

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % assignmentSets.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const assignments = assignmentSets[index];
  const stats = statSets[index];

  return (
    <section className="relative px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-36">
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div variants={fade}>
            <span className="eyebrow">
              <Sparkles size={13} /> Built for students
            </span>
          </motion.div>

          <motion.h1
            variants={fade}
            className="mt-6 text-[2.6rem] font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl"
          >
            Never miss a{' '}
            <span className="gradient-text">deadline</span> again.
          </motion.h1>

          <motion.p variants={fade} className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            DeadlineMate keeps every assignment, exam, and reminder in one calm workspace — and tells you
            exactly what to work on today, so nothing slips through.
          </motion.p>

          <motion.div variants={fade} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#pricing" className="btn-primary min-h-12 px-7 text-sm font-semibold">
              Start free <ArrowRight size={17} />
            </a>
            <a href="#product-demo" className="btn-secondary min-h-12 px-7 text-sm font-semibold">
              See how it works
            </a>
          </motion.div>

          <motion.div variants={fade} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Free forever plan
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> No credit card needed
            </span>
          </motion.div>
        </motion.div>

        {/* Product mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-3 top-16 z-20 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[var(--shadow-md)] sm:flex"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Bell size={17} />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900">Reminder sent</p>
              <p className="text-[11px] text-slate-500">Essay due in 24h</p>
            </div>
          </motion.div>

          <div className="card overflow-hidden p-2 shadow-[var(--shadow-lg)]">
            <div className="rounded-[1rem] bg-gradient-to-b from-slate-50 to-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">This week</p>
                  <p className="text-xs text-slate-500">Week 7 · 4 active modules</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  On track
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {stats.map(([Icon, label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-white p-3">
                    <Icon size={16} className="text-indigo-600" />
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`${label}-${value}`}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-2 text-xl font-bold text-slate-900"
                      >
                        {value}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-[11px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
                <p className="mb-3 text-sm font-bold text-slate-900">Upcoming deadlines</p>
                <div className="space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {assignments.map(([name, due, urgency], i) => (
                      <motion.div
                        key={name}
                        layout
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ delay: i * 0.05, duration: 0.28 }}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${urgencyStyles[urgency]}`} />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{name}</p>
                            <p className="text-[11px] text-slate-500">{due}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold capitalize text-slate-400">{urgency}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
