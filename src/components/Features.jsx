import { AlarmClock, BarChart3, BookOpen, BrainCircuit, CalendarDays, CloudDownload, Layers3, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  ['Deadline radar', 'See urgent coursework before it becomes a panic moment.', AlarmClock],
  ['Smart reminders', 'Email and push alerts a week, a day, and an hour before each due date.', BrainCircuit],
  ['Assignment pipeline', 'Track every task from brief to submitted in one clear list.', CalendarDays],
  ['Exam countdown', 'Know exactly what is coming and how prepared you are.', Timer],
  ['Focus sessions', 'Turn due dates into realistic daily study blocks.', BookOpen],
  ['Progress insights', 'Spot which modules need attention this week.', BarChart3],
  ['Module hub', 'Keep lectures, projects, and notes grouped cleanly.', Layers3],
  ['LMS import', 'Pull deadlines straight from Canvas, Moodle, or Google Classroom.', CloudDownload],
];

export default function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow">Features</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Everything you need to stay ahead.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            DeadlineMate removes the messy setup and gives you a clear weekly system for academic progress.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, text, Icon], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: (index % 4) * 0.05 }}
              className="card card-hover p-6"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon size={21} />
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
