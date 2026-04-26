import Logo, { BrandWordmark } from './Logo.jsx';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="group flex items-center gap-3" aria-label="DeadlineMate home">
          <span className="transition duration-300 group-hover:scale-[1.03]">
            <Logo />
          </span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-300 transition hover:text-white">
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="#waitlist"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-300 hover:text-slate-950"
        >
          Join Waitlist
        </a>
      </nav>
    </header>
  );
}
