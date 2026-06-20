import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

const stats = [
  ['deadlines managed', 10000, '+'],
  ['student satisfaction', 95, '%'],
  ['universities reached', 40, '+'],
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
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Trusted by students managing busy semesters
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {stats.map(([label, value, suffix]) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <p className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                <Counter value={value} suffix={suffix} />
              </p>
              <p className="mt-1.5 text-sm text-slate-500">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
