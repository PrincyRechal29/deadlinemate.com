const plans = [
  ['Free Plan', '£0', ['3 modules', 'Basic deadline tracking', 'Manual reminders']],
  ['Student Pro', '£5', ['Unlimited modules', 'Smart study suggestions', 'Priority planning', 'Progress dashboard']],
  ['University Plan', 'Custom', ['Admin dashboard', 'Student analytics', 'Group support', 'Custom integrations']],
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">Pricing</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Start free, upgrade when your workload grows.</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map(([name, price, benefits], index) => (
            <article
              key={name}
              className={`reveal-card rounded-3xl border p-7 transition duration-300 hover:-translate-y-2 ${
                index === 1
                  ? 'button-glow border-cyan-300 bg-cyan-300 text-slate-950 shadow-2xl shadow-cyan-500/20'
                  : 'glass-card border-white/10 text-white'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-2xl font-black">{name}</h3>
              <p className="mt-4 text-4xl font-black">{price}</p>
              <ul className="mt-8 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className={index === 1 ? 'text-sm font-semibold text-slate-800' : 'text-sm text-slate-300'}>
                    {benefit}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className={`mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-full text-sm font-bold transition ${
                  index === 1 ? 'bg-slate-950 text-white hover:bg-slate-800' : 'border border-white/15 text-white hover:bg-white hover:text-slate-950'
                }`}
              >
                Choose plan
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
