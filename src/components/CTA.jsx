import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section id="cta" className="px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        className="ink-panel mx-auto max-w-6xl overflow-hidden rounded-[2rem] p-8 text-center md:p-16"
      >
        <p className="eyebrow">Start today</p>
        <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">Take control before the semester controls you.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Build a smarter academic workflow before the next deadline starts creating pressure.
        </p>
        <motion.a
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          href="#pricing"
          className="mt-9 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-black text-[#07111f] shadow-2xl shadow-blue-500/20 transition hover:-translate-y-0.5"
        >
          Join DeadlineMate Free <ArrowRight size={18} />
        </motion.a>
      </motion.div>
    </section>
  );
}
