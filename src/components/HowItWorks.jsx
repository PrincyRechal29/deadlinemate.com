import { motion } from 'framer-motion';

const steps = [
  ['01', 'Map your semester', 'Add modules, assessments, exam windows, and key academic milestones.'],
  ['02', 'Prioritise the pressure', 'DeadlineMate ranks urgency by date, workload, and importance.'],
  ['03', 'Follow the plan', 'Get daily focus blocks that make big deadlines feel manageable.'],
  ['04', 'Protect momentum', 'Track progress, build streaks, and stay ahead of the semester curve.'],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">From deadline chaos to a weekly operating system.</h2>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-300 via-violet-300 to-emerald-300 md:block" />
          <div className="space-y-6">
            {steps.map(([number, title, text], index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08, type: 'spring', stiffness: 120, damping: 18 }}
                className="glass-panel relative rounded-[1.5rem] p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-2xl font-black text-slate-950">{title}</h3>
                    <p className="mt-2 text-base leading-7 text-slate-600">{text}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
