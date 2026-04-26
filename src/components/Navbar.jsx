import { Menu } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Logo from './Logo.jsx';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/78 shadow-sm shadow-slate-200/40 backdrop-blur-2xl"
    >
      <motion.div
        style={{ scaleX }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-blue-600 via-violet-500 to-teal-500"
      />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" aria-label="DeadlineMate home" className="transition hover:scale-[1.02]">
          <Logo />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link text-sm font-semibold text-slate-600 transition hover:text-slate-950">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="button-secondary hidden rounded-full px-4 py-2 text-sm font-extrabold transition hover:-translate-y-0.5 sm:inline-flex"
          >
            Watch Demo
          </a>
          <a
            href="#pricing"
            className="button-primary rounded-full px-5 py-2.5 text-sm font-black transition hover:-translate-y-0.5"
          >
            Get Started
          </a>
          <button aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 text-slate-950 lg:hidden">
            <Menu size={18} />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
