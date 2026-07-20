import React from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1];

/**
 * Scroll-triggered fade-up reveal. Animates transform/opacity only (GPU
 * friendly) and fires once as the block enters the viewport. Use `delay`
 * in seconds to stagger siblings (~0.06s steps).
 */
export function Reveal({ children, delay = 0, y = 26, once = true, style, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-70px 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Animated number for stat values like "10,000+", "93%", "5 hrs". Parses the
 * numeric part, counts up when scrolled into view, and preserves the
 * surrounding text. Falls back to the final value for reduced motion.
 */
export function CountUp({ value, duration = 1400, style, ...rest }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  const reduced = useReducedMotion();
  const m = String(value).match(/^([^\d]*)([\d,]+)(.*)$/);
  const target = m ? parseInt(m[2].replace(/,/g, ''), 10) : 0;
  const hasComma = m ? m[2].includes(',') : false;
  const [n, setN] = React.useState(0);

  React.useEffect(() => {
    if (!inView || !m) return;
    if (reduced) { setN(target); return; }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setN(Math.round(target * easeOutCubic(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target, duration, m ? 1 : 0]);

  if (!m) return <span ref={ref} style={style} {...rest}>{value}</span>;
  const shown = hasComma ? n.toLocaleString('en-US') : String(n);
  return <span ref={ref} style={style} {...rest}>{m[1]}{shown}{m[3]}</span>;
}
