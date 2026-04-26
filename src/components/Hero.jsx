import { ArrowRight, BarChart3, CalendarDays, CheckCircle2, Clock3, Flame, PlayCircle, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BrandWordmark } from './Logo.jsx';

const assignmentSets = [
  [
    ['Research essay', 'Tomorrow', 'High', 'bg-rose-400'],
    ['Economics quiz', '3 days', 'Medium', 'bg-amber-300'],
    ['Group deck', 'Friday', 'High', 'bg-violet-300'],
  ],
  [
    ['Lab report', 'Today', 'Critical', 'bg-red-400'],
    ['Reading notes', '2 days', 'Medium', 'bg-cyan-300'],
    ['Stats worksheet', 'Monday', 'Low', 'bg-emerald-300'],
  ],
  [
    ['Exam revision', '6 days', 'High', 'bg-violet-300'],
    ['Case study', 'Thursday', 'Medium', 'bg-blue-300'],
    ['Seminar prep', 'Tomorrow', 'High', 'bg-rose-400'],
  ],
];

const statSets = [
  [
    [CalendarDays, 'Deadlines', '18'],
    [Clock3, 'Focus hours', '7.5'],
    [Flame, 'Streak', '14'],
  ],
  [
    [CalendarDays, 'Deadlines', '21'],
    [Clock3, 'Focus hours', '9.0'],
    [Flame, 'Streak', '15'],
  ],
  [
    [CalendarDays, 'Deadlines', '16'],
    [Clock3, 'Focus hours', '6.5'],
    [Flame, 'Streak', '16'],
  ],
];

const analyticsSets = [
  [45, 70, 55, 88, 76, 96],
  [62, 48, 82, 66, 90, 74],
  [55, 78, 64, 92, 84, 68],
];

const floatingCards = [
  { label: 'Exam countdown', value: '12 days', className: 'left-0 top-8 hidden xl:block' },
  { label: 'Study streak', value: '14 days', className: 'right-0 top-24 hidden xl:block' },
  { label: 'Focus today', value: '3 sessions', className: 'bottom-4 left-12 hidden lg:block' },
];

const heroPhrases = ['semester', 'deadlines', 'exams', 'study plan'];

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [dashboardIndex, setDashboardIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 24 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % heroPhrases.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDashboardIndex((current) => (current + 1) % assignmentSets.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  const assignments = assignmentSets[dashboardIndex];
  const stats = statSets[dashboardIndex];
  const analytics = analyticsSets[dashboardIndex];

  return (
    <section onMouseMove={handleMouseMove} className="relative px-4 pb-24 pt-36 sm:px-6 lg:px-8 lg:pb-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <div className="aurora-ribbon aurora-ribbon-one" />
      <div className="aurora-ribbon aurora-ribbon-two" />
      <div className="gradient-orb left-1/2 top-20 h-[42rem] w-[42rem] -translate-x-1/2 bg-sky-300/45" />
      <div className="gradient-orb right-0 top-36 h-[32rem] w-[32rem] bg-violet-300/40" />
      <div className="hero-constellation" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          className="relative z-10"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-xl shadow-cyan-200/30 backdrop-blur"
          >
            <Sparkles size={16} />
            The academic command center for serious students
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} className="mt-8">
            <BrandWordmark className="text-5xl leading-none sm:text-7xl lg:text-8xl" />
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            className="mt-6 max-w-4xl text-5xl font-bold leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl"
          >
            Your{' '}
            <span className="relative inline-grid min-w-[8.6ch] overflow-hidden align-bottom text-[#284cff] sm:min-w-[9ch]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={heroPhrases[phraseIndex]}
                  initial={{ y: '95%', opacity: 0, filter: 'blur(10px)', rotateX: -55 }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)', rotateX: 0 }}
                  exit={{ y: '-95%', opacity: 0, filter: 'blur(10px)', rotateX: 55 }}
                  transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  className="col-start-1 row-start-1 bg-gradient-to-r from-[#284cff] via-[#7c3aed] to-[#007c89] bg-clip-text text-transparent"
                >
                  {heroPhrases[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            , finally under control.
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl"
          >
            Plan deadlines, exams, modules, and focus sessions in one calm dashboard built for modern university life.
          </motion.p>

          <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} className="mt-9 flex flex-col gap-4 sm:flex-row">
            <motion.a
              whileHover={{ scale: 1.035, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#pricing"
              className="button-primary inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-8 text-sm font-black"
            >
              Start Free <ArrowRight size={18} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.035, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#product-demo"
              className="button-secondary inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-8 text-sm font-black transition hover:-translate-y-0.5"
            >
              <PlayCircle size={18} /> Watch Demo
            </motion.a>
          </motion.div>
        </motion.div>

        <div className="relative min-h-[560px]">
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.label}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute z-20 rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-2xl shadow-slate-300/50 backdrop-blur-xl ${card.className}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{card.value}</p>
            </motion.div>
          ))}

          <motion.div style={{ rotateX, rotateY, transformPerspective: 1100 }} className="relative mx-auto max-w-xl">
            <div className="dashboard-frame rounded-[2rem] border border-white/10 bg-slate-950/90 p-4 text-white shadow-2xl shadow-indigo-300/50 backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#080b16] p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-white">Semester cockpit</p>
                    <p className="mt-1 text-xs text-slate-500">Week 7 · 4 active modules</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">On track</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {stats.map(([Icon, label, value]) => (
                    <div key={label} className="motion-surface rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                      <Icon size={18} className="text-cyan-300" />
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`${label}-${value}`}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          className="mt-3 text-2xl font-black"
                        >
                          {value}
                        </motion.p>
                      </AnimatePresence>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="motion-surface mt-5 rounded-3xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-black">Upcoming assignments</p>
                    <BarChart3 size={18} className="text-cyan-300" />
                  </div>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                    {assignments.map(([name, due, priority, color], index) => (
                      <motion.div
                        key={name}
                        layout
                        initial={{ opacity: 0, x: -18, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, scale: 0.98 }}
                        transition={{ delay: index * 0.06, duration: 0.32 }}
                        className="flex items-center justify-between rounded-2xl bg-slate-950/80 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-3 w-3 rounded-full ${color}`} />
                          <div>
                            <p className="text-sm font-bold text-white">{name}</p>
                            <p className="text-xs text-slate-500">Due {due}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">{priority}</span>
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_0.85fr]">
                  <div className="motion-surface rounded-3xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-sm font-black">Progress analytics</p>
                    <div className="mt-5 flex h-28 items-end gap-3">
                      {analytics.map((height, index) => (
                        <motion.span
                          key={`${dashboardIndex}-${index}`}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.8 + index * 0.08, duration: 0.7, ease: 'easeOut' }}
                          className="flex-1 rounded-t-xl bg-gradient-to-t from-cyan-400 to-violet-300"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                    <CheckCircle2 className="text-emerald-300" size={22} />
                    <p className="mt-4 text-sm font-black">Priority tasks</p>
                    <p className="mt-2 text-xs leading-5 text-emerald-100">Essay outline, flashcards, lab review</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
