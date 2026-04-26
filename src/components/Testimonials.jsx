import { motion } from 'framer-motion';

const testimonials = [
  ['DeadlineMate saved my semester.', 'I finally knew what mattered each day instead of opening five different apps and guessing.', 'Aisha', 'Psychology student', 'A'],
  ['It made deadlines feel manageable.', 'The urgency view and study blocks helped me work earlier instead of rushing at midnight.', 'Daniel', 'Engineering student', 'D'],
  ['This feels built for university life.', 'It is structured enough for modules and exams, but still clean enough to use every morning.', 'Maya', 'Business student', 'M'],
];

export default function Testimonials() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Student love</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">A calmer semester starts with a better system.</h2>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map(([quote, body, name, role, avatar], index) => (
            <motion.article
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="glass-panel rounded-[1.5rem] p-7"
            >
              <p className="text-2xl font-black text-slate-950">"{quote}"</p>
              <p className="mt-5 leading-7 text-slate-600">{body}</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-300 text-sm font-black text-slate-950">
                  {avatar}
                </div>
                <div>
                  <p className="font-black text-slate-950">{name}</p>
                  <p className="text-sm text-slate-500">{role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
