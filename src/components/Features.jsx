import {
  AlarmClock,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Layers3,
  Smartphone,
} from 'lucide-react';

const features = [
  ['Smart deadline reminders', AlarmClock],
  ['Assignment and exam tracking', CalendarDays],
  ['Module organisation', Layers3],
  ['AI-style study planning suggestions', BrainCircuit],
  ['Priority-based task planning', CheckCircle2],
  ['Progress dashboard', BarChart3],
  ['Focus session planner', BookOpen],
  ['Mobile-friendly access', Smartphone],
];

export default function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">Features</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Everything your study week needs.</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            DeadlineMate brings modules, dates, reminders, and progress into one calm planning system.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, Icon], index) => (
            <article
              key={title}
              className="glass-card reveal-card group rounded-3xl border border-white/10 p-6 transition duration-300 hover:-translate-y-2 hover:border-cyan-300/50"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="icon-orbit grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
