import { AlarmClock, BarChart3, BookOpen, BrainCircuit, CalendarDays, Cloud, Layers3, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  ['Deadline Radar', 'See urgent coursework before it becomes a panic moment.', AlarmClock],
  ['Study Plan Engine', 'Convert due dates into realistic daily focus blocks.', BrainCircuit],
  ['Assignment Pipeline', 'Track every task from brief to submitted.', CalendarDays],
  ['Exam Countdown', 'Know exactly what is coming and how prepared you are.', Timer],
  ['Focus Studio', 'Build deep work sessions around your actual timetable.', BookOpen],
  ['Progress Intelligence', 'Spot which modules need attention this week.', BarChart3],
  ['Module Hub', 'Keep lectures, seminars, projects, and notes grouped cleanly.', Layers3],
  ['Anywhere Sync', 'A polished workflow across laptop, tablet, and phone.', Cloud],
];

export default function Features() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow">Features</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Designed for the way students actually work.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            DeadlineMate removes the messy setup work and gives students a clear weekly system for academic progress.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, text, Icon], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.04, type: 'spring', stiffness: 120, damping: 18 }}
              whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
              className="feature-card group rounded-[1.5rem] p-6"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#284cff]/10 text-[#284cff] transition group-hover:bg-[#07111f] group-hover:text-white">
                <Icon size={22} />
              </div>
              <h3 className="mt-6 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
