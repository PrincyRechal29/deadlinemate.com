import Logo from './Logo.jsx';

const links = ['Features', 'How It Works', 'Pricing', 'FAQ'];
const socials = ['X', 'LinkedIn', 'Instagram'];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 px-4 pb-24 pt-12 sm:px-6 md:pb-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-md leading-7 text-slate-500">
            Deadline planning, study focus, reminders, and progress tracking for modern students.
          </p>
        </div>
        <div>
          <p className="font-black text-slate-950">Product</p>
          <div className="mt-4 grid gap-3">
            {links.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replaceAll(' ', '-')}`} className="text-sm text-slate-500 transition hover:text-slate-950">
                {link}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-black text-slate-950">Social</p>
          <div className="mt-4 grid gap-3">
            {socials.map((link) => (
              <a key={link} href="#" className="text-sm text-slate-500 transition hover:text-slate-950">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-4 border-t border-slate-200/80 pt-6 text-sm text-slate-500 sm:flex-row">
        <p>Copyright 2026 DeadlineMate. All rights reserved.</p>
        <p>DeadlineMate.com</p>
      </div>
    </footer>
  );
}
