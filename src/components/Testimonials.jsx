import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  ['DeadlineMate saved my semester.', 'I finally knew what mattered each day instead of opening five different apps and guessing.', 'Aisha', 'Psychology student', 'A'],
  ['It made deadlines feel manageable.', 'The urgency view and study blocks helped me work earlier instead of rushing at midnight.', 'Daniel', 'Engineering student', 'D'],
  ['This feels built for university life.', 'Structured enough for modules and exams, but still clean enough to use every morning.', 'Maya', 'Business student', 'M'],
];

export default function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Loved by students</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            A calmer semester starts with a better system.
          </h2>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {testimonials.map(([quote, body, name, role, avatar], index) => (
            <motion.article
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.07 }}
              className="card card-hover flex flex-col p-7"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-lg font-bold text-slate-950">"{quote}"</p>
              <p className="mt-3 flex-1 leading-7 text-slate-600">{body}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-sm font-bold text-white">
                  {avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-950">{name}</p>
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
