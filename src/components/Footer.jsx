import Logo, { BrandWordmark } from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Logo compact />
          <BrandWordmark className="hidden text-2xl lg:inline-block" />
          <p className="text-sm text-slate-400">Intelligent deadline planning for university students.</p>
        </div>
        <p className="text-sm text-slate-500">Copyright 2026 DeadlineMate. All rights reserved.</p>
      </div>
    </footer>
  );
}
