import React from 'react';
import { Button } from './ui/Button.jsx';
import { Card } from './ui/Card.jsx';
import { SegmentedToggle } from './ui/SegmentedToggle.jsx';
import { Icons } from './ui/icons.jsx';
import { SectionHead } from './ui/layout.jsx';
import { Reveal } from './ui/motion.jsx';

export default function Pricing({ onCta }) {
  const [annual, setAnnual] = React.useState(true);
  const plans = [
    { name: 'Free', monthly: 0, annual: 0, desc: 'For students getting organised.', cta: 'Get started', featured: false, benefits: ['Unlimited assignments', 'Email reminders', '1 calendar import', 'Mobile + desktop apps'] },
    { name: 'Pro', monthly: 3.49, annual: 29, desc: 'For students who want serious momentum.', cta: 'Start 14-day free trial', featured: true, benefits: ['Everything in Free', 'Multiple reminders per task', 'Push + email + SMS alerts', 'Smart weekly planning', 'Progress analytics & streaks', 'Unlimited LMS imports'] },
    { name: 'Campus', monthly: null, annual: null, desc: 'For departments and student support teams.', cta: 'Contact us', featured: false, benefits: ['Team dashboards', 'Cohort analytics', 'Admin controls', 'Priority support'] },
  ];
  return (
    <section id="pricing" style={{ padding: '104px 0', background: 'var(--page-2)' }}>
      <div className="dm-wrap">
        <SectionHead
          kicker="Pricing"
          title="Start free. Upgrade when it gets serious."
          sub="Less than a coffee a month to never miss a deadline again."
          aside={
            <SegmentedToggle
              value={annual ? 'annual' : 'monthly'}
              onChange={(v) => setAnnual(v === 'annual')}
              options={[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual', badge: 'Save 30%' }]}
            />
          }
        />
        <div className="dm-grid-3" style={{ marginTop: 52, alignItems: 'start' }}>
          {plans.map((p, i) => {
            const custom = p.monthly === null;
            const price = annual ? p.annual : p.monthly;
            const fg = p.featured;
            return (
              <Reveal key={p.name} delay={i * 0.07}>
              <Card
                padding="xl"
                className={fg ? 'dm-invert' : undefined}
                style={{
                  position: 'relative',
                  border: fg ? '1px solid var(--ink)' : '1px solid var(--line)',
                  boxShadow: fg ? 'var(--shadow-lg)' : 'none',
                }}
              >
                {fg && (
                  <span style={{ position: 'absolute', right: 26, top: 28, padding: '4px 11px', borderRadius: 'var(--radius-pill)', background: 'var(--ink)', color: 'var(--page)', fontSize: '0.7rem', fontWeight: 600 }}>Popular</span>
                )}
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)' }}>{p.name}</h3>
                <p style={{ margin: '7px 0 0', fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--ink-muted)' }}>{p.desc}</p>
                <div style={{ margin: '24px 0 0', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  {custom ? (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--ink)' }}>Custom</span>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--ink)' }}>£{price}</span>
                      {price > 0 && <span style={{ fontSize: '0.86rem', color: 'var(--ink-faint)' }}>{annual ? '/year' : '/month'}</span>}
                    </>
                  )}
                </div>
                <div style={{ marginTop: 24 }}>
                  <Button variant={fg ? 'primary' : 'secondary'} full onClick={onCta}>{p.cta}</Button>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '26px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.benefits.map((b) => (
                    <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
                      <Icons.Check size={15} color="var(--accent)" />
                      <span style={{ color: 'var(--ink-soft)' }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              </Reveal>
            );
          })}
        </div>
        <p style={{ marginTop: 30, textAlign: 'center', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>Pro includes a 14-day free trial. No credit card required to start. Cancel anytime.</p>
      </div>
    </section>
  );
}
