import { Bell, BookMarked, CheckCircle2, Clock3, LayoutDashboard, Settings, Target } from 'lucide-react';

const modules = [
  ['Psychology', 'Essay due', '76%'],
  ['Statistics', 'Exam prep', '52%'],
  ['Marketing', 'Presentation', '68%'],
];

const tasks = ['Finish essay outline', 'Revise regression notes', 'Submit group slides'];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">Dashboard preview</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              A realistic command centre for student deadlines.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-slate-300">
            Dummy data shows how students can see urgent work, today's focus blocks, module health, and reminder status.
          </p>
        </div>
        <div className="dashboard-shell shine-panel rounded-[2rem] border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-cyan-950/30">
          <div className="grid overflow-hidden rounded-[1.5rem] bg-slate-950 lg:grid-cols-[230px_1fr]">
            <aside className="border-b border-white/10 bg-slate-900/80 p-5 lg:border-b-0 lg:border-r">
              <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-black text-white">DeadlineMate</p>
                <p className="mt-1 text-xs text-slate-400">Student dashboard</p>
              </div>
              {[['Dashboard', LayoutDashboard], ['Modules', BookMarked], ['Study Plan', Clock3], ['Goals', Target], ['Settings', Settings]].map(
                ([label, Icon], index) => (
                  <div
                    key={label}
                    className={`mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:translate-x-1 ${
                      index === 0 ? 'bg-cyan-300 text-slate-950' : 'text-slate-300'
                    }`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <Icon size={17} />
                    {label}
                  </div>
                ),
              )}
            </aside>
            <div className="grid gap-5 p-5 lg:grid-cols-3">
              <section className="glass-card rounded-3xl border border-white/10 p-5 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Upcoming deadlines</h3>
                    <p className="text-sm text-slate-400">Next 7 days</p>
                  </div>
                  <span className="rounded-full bg-rose-400/15 px-3 py-1 text-xs font-bold text-rose-300">3 urgent</span>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    ['Research Methods Essay', 'Tomorrow, 4:00 PM', 'High'],
                    ['Statistics Quiz', 'Wednesday, 9:00 AM', 'Medium'],
                    ['Marketing Slides', 'Friday, 12:00 PM', 'High'],
                  ].map(([title, time, priority], index) => (
                    <div
                      key={title}
                      className="task-row flex flex-col justify-between gap-3 rounded-2xl bg-slate-900 p-4 transition hover:-translate-y-1 hover:bg-slate-800 sm:flex-row sm:items-center"
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      <div>
                        <p className="font-bold">{title}</p>
                        <p className="mt-1 text-sm text-slate-400">{time}</p>
                      </div>
                      <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cyan-200">{priority}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="animate-pulse-border rounded-3xl border border-cyan-300/25 bg-cyan-300/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-300 text-slate-950">
                    <Bell size={19} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Reminder</h3>
                    <p className="mt-2 text-sm leading-6 text-cyan-100">Essay draft review starts in 45 minutes.</p>
                  </div>
                </div>
              </section>
              <section className="glass-card rounded-3xl border border-white/10 p-5">
                <h3 className="text-lg font-bold">Today's study plan</h3>
                <div className="mt-5 space-y-3">
                  {['10:00 Essay outline', '13:30 Stats flashcards', '16:00 Group slides'].map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
              <section className="glass-card rounded-3xl border border-white/10 p-5">
                <h3 className="text-lg font-bold">Module cards</h3>
                <div className="mt-5 space-y-4">
                  {modules.map(([name, label, progress]) => (
                    <div key={name}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-semibold">{name}</span>
                        <span className="text-slate-400">{label}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="progress-fill h-full rounded-full bg-cyan-300" style={{ '--target-width': progress }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="glass-card rounded-3xl border border-white/10 p-5">
                <h3 className="text-lg font-bold">Priority tasks</h3>
                <div className="mt-5 space-y-3">
                  {tasks.map((task) => (
                    <div key={task} className="flex items-center gap-3 text-sm text-slate-200">
                      <CheckCircle2 size={18} className="text-emerald-300" />
                      {task}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
