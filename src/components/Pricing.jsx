import React from 'react';
import { Button } from './ui/Button.jsx';
import { Card } from './ui/Card.jsx';
import { SegmentedToggle } from './ui/SegmentedToggle.jsx';
import { Icons } from './ui/icons.jsx';
import { SectionHead } from './ui/layout.jsx';

export default function Pricing({ onCta }) {
  const [annual, setAnnual] = React.useState(true);
  const plans = [
    { name: 'Free', monthly: 0, annual: 0, desc: 'For students getting organised.', cta: 'Get started', featured: false, benefits: ['Unlimited assignments', 'Email reminders', '1 calendar import', 'Mobile + desktop apps'] },
    { name: 'Pro', monthly: 3.49, annual: 29, desc: 'For students who want serious momentum.', cta: 'Start 14-day free trial', featured: true, benefits: ['Everything in Free', 'Multiple reminders per task', 'Push + email + SMS alerts', 'Smart weekly planning', 'Progress analytics & streaks', 'Unlimited LMS imports'] },
    { name: 'Campus', monthly: null, annual: null, desc: 'For departments and student support teams.', cta: 'Contact us', featured: false, benefits: ['Team dashboards', 'Cohort analytics', 'Admin controls', 'Priority support'] },
  ];
  return (
    <section id="pricing" style={{ padding: '80px 0' }}>
      <div className="dm-wrap">
        <SectionHead
          kicker="Pricing"
          title="Start free. Upgrade when it"
          accent="gets serious."
          sub="Less than a coffee a month to never miss a deadline again."
          aside={
            <SegmentedToggle
              value={annual ? 'annual' : 'monthly'}
              onChange={(v) => setAnnual(v === 'annual')}
              options={[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual', badge: 'Save 30%' }]}
            />
          }
        />
        <div className="dm-grid-3" style={{ marginTop: 44, alignItems: 'start' }}>
          {plans.map((p) => {
            const custom = p.monthly === null;
            const price = annual ? p.annual : p.monthly;
            return (
              <Card key={p.name} dark={p.featured} padding="lg" style={{ position: 'relative', transform: p.featured ? 'none' : undefined }}>
                {p.featured && <span style={{ position: 'absolute', right: 22, top: 22, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.08em', fontWeight: 700, color: '#fff' }}>MOST POPULAR</span>}
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: p.featured ? '#fff' : 'var(--ink)' }}>{p.name}</h3>
                <p style={{ margin: '8px 0 0', fontSize: '0.86rem', lineHeight: 1.5, color: p.featured ? 'rgba(255,255,255,0.7)' : 'var(--ink-muted)' }}>{p.desc}</p>
                <div style={{ margin: '22px 0 0', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  {custom ? <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: p.featured ? '#fff' : 'var(--ink)' }}>Custom</span> : <>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: p.featured ? '#fff' : 'var(--ink)' }}>£{price}</span>
                    {price > 0 && <span style={{ fontSize: '0.85rem', color: p.featured ? 'rgba(255,255,255,0.6)' : 'var(--ink-muted)' }}>{annual ? '/year' : '/month'}</span>}
                  </>}
                </div>
                <div style={{ marginTop: 22 }}>
                  <Button variant={p.featured ? 'primary' : 'secondary'} full onClick={onCta}>{p.cta}</Button>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.benefits.map((b) => (
                    <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.86rem' }}>
                      <Icons.Check size={16} color={p.featured ? 'var(--brand-lime)' : 'var(--urg-low)'} />
                      <span style={{ color: p.featured ? 'rgba(255,255,255,0.85)' : 'var(--ink-soft)' }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
        <p style={{ marginTop: 28, textAlign: 'center', fontSize: '0.85rem', color: 'var(--ink-muted)' }}>Pro includes a 14-day free trial. No credit card required to start. Cancel anytime.</p>
      </div>
    </section>
  );
}
