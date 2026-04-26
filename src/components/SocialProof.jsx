import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

const stats = [
  ['10,000+', 'deadlines managed', 10000, '+'],
  ['95%', 'productivity satisfaction', 95, '%'],
  ['40+', 'student workflows supported', 40, '+'],
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1600, bounce: 0 });
  const rounded = useTransform(spring, (latest) => `${Math.round(latest).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function SocialProof() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel mx-auto max-w-7xl rounded-[2rem] p-6">
        <p className="text-center text-sm font-extrabold uppercase tracking-[0.28em] text-slate-500">
          Trusted by students who manage complex semesters
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stats.map(([label, text, value, suffix]) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 text-center shadow-xl shadow-slate-200/50"
            >
              <p className="text-4xl font-black text-indigo-950">
                <Counter value={value} suffix={suffix} />
              </p>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
