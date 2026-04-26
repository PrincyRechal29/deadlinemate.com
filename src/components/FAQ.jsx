const faqs = [
  ['Is DeadlineMate free?', 'Yes. The Free Plan is designed for students who want basic deadline tracking across up to 3 modules.'],
  ['Can I use it for university assignments?', 'Yes. DeadlineMate is built around assignments, exams, modules, study sessions, and reminders.'],
  ['Can I track multiple modules?', 'Yes. Student Pro supports unlimited modules so your whole course can live in one dashboard.'],
  ['Does it work on mobile?', 'Yes. The interface is responsive and designed for quick checks from phones, tablets, and laptops.'],
  ['Does it replace my calendar?', 'It complements your calendar by turning academic deadlines into tasks, plans, and progress updates.'],
];

export default function FAQ() {
  return (
    <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">FAQ</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Questions students ask first.</h2>
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map(([question, answer]) => (
            <details key={question} className="glass-card group rounded-3xl border border-white/10 p-6 transition hover:border-cyan-300/40">
              <summary className="cursor-pointer list-none text-lg font-bold text-white">{question}</summary>
              <p className="mt-4 leading-7 text-slate-300">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
