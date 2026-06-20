import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    monthly: 0,
    annual: 0,
    description: 'For students getting organised.',
    cta: 'Get started',
    featured: false,
    benefits: ['Unlimited assignments', 'Email reminders', '1 calendar import', 'Mobile + desktop'],
  },
  {
    name: 'Pro',
    monthly: 3.49,
    annual: 29,
    description: 'For students who want serious momentum.',
    cta: 'Start 14-day free trial',
    featured: true,
    benefits: [
      'Everything in Free',
      'Multiple reminders per task',
      'Push + email + SMS alerts',
      'Smart weekly planning',
      'Progress analytics & streaks',
      'Unlimited LMS imports',
    ],
  },
  {
    name: 'Campus',
    monthly: null,
    annual: null,
    description: 'For departments and student support teams.',
    cta: 'Contact us',
    featured: false,
    benefits: ['Team dashboards', 'Cohort analytics', 'Admin controls', 'Priority support'],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pricing</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Start free. Upgrade when it gets serious.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Less than a coffee a month to never miss a deadline again.
          </p>

          <div className="mt-7 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-[var(--shadow-sm)]">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                !annual ? 'bg-slate-900 text-white' : 'text-slate-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                annual ? 'bg-slate-900 text-white' : 'text-slate-500'
              }`}
            >
              Annual
              <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                Save 30%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const isCustom = plan.monthly === null;
            const price = annual ? plan.annual : plan.monthly;
            const period = annual ? '/year' : '/month';

            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.07 }}
                className={`relative rounded-2xl p-7 ${
                  plan.featured
                    ? 'panel-dark'
                    : 'card'
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
                    Most popular
                  </span>
                )}
                <h3 className={`text-xl font-bold ${plan.featured ? 'text-white' : 'text-slate-950'}`}>
                  {plan.name}
                </h3>
                <p className={`mt-2 text-sm leading-6 ${plan.featured ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  {isCustom ? (
                    <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-slate-950'}`}>
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-slate-950'}`}>
                        £{price}
                      </span>
                      {price > 0 && (
                        <span className={`text-sm ${plan.featured ? 'text-slate-400' : 'text-slate-500'}`}>
                          {period}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <a
                  href="#cta"
                  className={`mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition ${
                    plan.featured
                      ? 'bg-white text-slate-950 hover:bg-slate-100'
                      : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                </a>

                <ul className="mt-7 space-y-3">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2.5 text-sm">
                      <Check size={16} className={plan.featured ? 'text-emerald-400' : 'text-emerald-600'} />
                      <span className={plan.featured ? 'text-slate-200' : 'text-slate-700'}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Pro includes a 14-day free trial. No credit card required to start. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
