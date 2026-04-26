import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  ['Starter', '£0', 'For students getting organised.', ['3 modules', 'Basic reminders']],
  ['Pro', '£5', 'For students who want serious momentum.', ['Unlimited modules', 'Smart planning', 'Progress intelligence', 'Priority support']],
  ['Campus', 'Custom', 'For departments and student support teams.', ['Team dashboards', 'Cohort analytics', 'Admin controls']],
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Pricing</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Start simple. Upgrade when your semester gets serious.</h2>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map(([name, price, description, benefits], index) => {
            const featured = name === 'Pro';
            return (
              <motion.article
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -10 }}
                className={`rounded-[1.75rem] border p-7 ${
                  featured
                    ? 'relative border-indigo-200 bg-slate-950 text-white shadow-2xl shadow-indigo-500/25'
                    : 'border-slate-200/80 bg-white/75 text-slate-950 shadow-xl shadow-slate-200/50 backdrop-blur'
                }`}
              >
                {featured && <span className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">Most popular</span>}
                <h3 className="text-2xl font-black">{name}</h3>
                <p className={`mt-3 text-sm leading-6 ${featured ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>
                <p className="mt-7 text-5xl font-black">{price}</p>
                <ul className="mt-8 space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle2 size={18} className={featured ? 'text-emerald-300' : 'text-emerald-600'} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full text-sm font-black transition ${
                    featured ? 'bg-white text-slate-950 hover:bg-slate-100' : 'border border-slate-300/80 text-slate-950 hover:bg-slate-950 hover:text-white'
                  }`}
                >
                  {featured ? 'Start Pro' : 'Choose plan'}
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
