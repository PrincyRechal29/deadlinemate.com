import { motion } from 'framer-motion';

const steps = [
  ['01', 'Add your deadlines', 'Type them in, or import your whole semester from Canvas, Moodle, or Google Classroom in one click.'],
  ['02', 'See what matters today', 'DeadlineMate ranks everything by due date, workload, and importance — so you always know what to start.'],
  ['03', 'Get reminded in time', 'Email and push alerts arrive a week, a day, and an hour before each deadline. Nothing slips.'],
  ['04', 'Stay ahead all term', 'Track progress, build streaks, and watch your stress drop as the semester stays under control.'],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            From deadline chaos to calm in four steps.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, text], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.07 }}
              className="card p-6"
            >
              <span className="display-font text-2xl font-bold gradient-text">{number}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
