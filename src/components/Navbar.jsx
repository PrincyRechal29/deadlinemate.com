import { ArrowRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl"
    >
      <motion.div
        style={{ scaleX }}
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-indigo-600 to-violet-500"
      />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <a href="#" aria-label="DeadlineMate home" className="transition hover:opacity-90">
          <Logo />
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link text-sm font-medium">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <a href="#pricing" className="hidden text-sm font-semibold text-slate-600 transition hover:text-slate-950 sm:inline-flex">
            Sign in
          </a>
          <a href="#pricing" className="btn-primary hidden px-5 py-2.5 text-sm font-semibold sm:inline-flex">
            Start free <ArrowRight size={16} />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-950 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24 }}
            className="overflow-hidden border-t border-slate-200/70 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-4 py-4 sm:px-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 w-full px-5 py-3 text-sm font-semibold"
              >
                Start free <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
