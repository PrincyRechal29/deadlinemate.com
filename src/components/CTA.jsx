import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section id="cta" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        className="panel-dark mx-auto max-w-5xl overflow-hidden p-10 text-center md:p-16"
      >
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Take control before the semester controls you.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-300">
          Join thousands of students who stopped missing deadlines. Free to start, no credit card needed.
        </p>
        <a href="#pricing" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5">
          Start free <ArrowRight size={18} />
        </a>
      </motion.div>
    </section>
  );
}
