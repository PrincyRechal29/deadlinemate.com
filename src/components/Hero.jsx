import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { BrandWordmark } from './Logo.jsx';

export default function Hero() {
  return (
    <section className="relative px-4 pb-20 pt-36 sm:px-6 lg:px-8 lg:pb-28">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full border border-cyan-300/10 bg-cyan-300/[0.03] blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <div className="animate-reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200 shadow-lg shadow-cyan-950/30">
            <Sparkles size={16} />
            Built for ambitious university students
          </div>
          <div className="mt-8 flex flex-col items-start gap-4">
            <BrandWordmark className="text-6xl sm:text-7xl lg:text-8xl" />
            <p className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-200">
              Master your time before deadlines master you
            </p>
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Never Miss a Deadline Again
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Track assignments, plan study sessions, and stay organised with smart deadline reminders.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="#waitlist"
              className="button-glow inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-7 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-white"
            >
              Get Started <ArrowRight size={18} />
            </a>
            <a
              href="#dashboard"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
            >
              <PlayCircle size={18} /> View Demo
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-center sm:text-left">
            {[
              ['24/7', 'deadline visibility'],
              ['8+', 'student tools'],
              ['100%', 'mobile ready'],
            ].map(([value, label]) => (
              <div key={label} className="glass-card rounded-3xl border border-white/10 p-4">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative animate-float-soft">
          <div className="shine-panel rounded-[2rem] border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-cyan-950/40 backdrop-blur">
            <div className="rounded-[1.5rem] bg-slate-950 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Week overview</p>
                  <p className="text-xs text-slate-400">Monday, 10:00 AM</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                  On track
                </span>
              </div>
              <div className="grid gap-3">
                {[
                  ['Research Methods Essay', 'Due tomorrow', '82%', 'bg-rose-400'],
                  ['Statistics Exam Prep', '3 sessions left', '54%', 'bg-cyan-300'],
                  ['Group Presentation', 'Due Friday', '68%', 'bg-emerald-300'],
                ].map(([title, meta, progress, color]) => (
                  <div key={title} className="glass-card rounded-2xl border border-white/10 p-4 transition hover:-translate-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-white">{title}</p>
                        <p className="mt-1 text-xs text-slate-400">{meta}</p>
                      </div>
                      <p className="text-sm font-bold text-white">{progress}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${color}`} style={{ width: progress }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
