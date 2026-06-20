import Logo from './Logo.jsx';

const columns = [
  ['Product', [['Features', '#features'], ['How it works', '#how-it-works'], ['Pricing', '#pricing'], ['FAQ', '#faq']]],
  ['Company', [['About', '#'], ['Blog', '#'], ['Careers', '#'], ['Contact', '#']]],
  ['Legal', [['Privacy', '#'], ['Terms', '#'], ['Cookies', '#']]],
];

const socials = ['X', 'LinkedIn', 'Instagram'];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 pb-12 pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs leading-7 text-slate-500">
            Deadline planning, study focus, reminders, and progress tracking for modern students.
          </p>
        </div>
        {columns.map(([title, links]) => (
          <div key={title}>
            <p className="text-sm font-bold text-slate-950">{title}</p>
            <div className="mt-4 grid gap-3">
              {links.map(([label, href]) => (
                <a key={label} href={href} className="text-sm text-slate-500 transition hover:text-slate-950">
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center">
        <p>© 2026 DeadlineMate. All rights reserved.</p>
        <div className="flex gap-5">
          {socials.map((social) => (
            <a key={social} href="#" className="transition hover:text-slate-950">
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
