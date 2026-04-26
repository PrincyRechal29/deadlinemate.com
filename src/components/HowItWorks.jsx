const steps = [
  ['01', 'Add your modules', 'Create a clean workspace for each class, seminar, or project.'],
  ['02', 'Add assignments, exams, and deadlines', 'Capture key dates, notes, weighting, and submission windows.'],
  ['03', 'DeadlineMate creates a smart study plan', 'Turn due dates into manageable study sessions and priority tasks.'],
  ['04', 'Get reminders and track your progress', 'Stay ahead with reminders, completion tracking, and weekly visibility.'],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">How it works</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">From syllabus chaos to a weekly plan.</h2>
          </div>
          <div className="grid gap-4">
            {steps.map(([number, title, text], index) => (
              <article
                key={title}
                className="glass-card reveal-card rounded-3xl border border-white/10 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/40"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <span className="step-number grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="mt-2 leading-7 text-slate-300">{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
