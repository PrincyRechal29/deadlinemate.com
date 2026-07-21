import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider.jsx';
import { invokeFunction } from '../lib/supabase.js';
import { PageHeader } from '../components/ui.jsx';
import Button from '../../components/ui/Button.jsx';

const PRO_FEATURES = [
  'Unlimited reminders per deadline',
  'Push & SMS reminders, not just email',
  'Unlimited calendar imports & daily auto-sync',
  'Shared class deadlines for your whole cohort',
  'Priority support',
];

export default function Billing() {
  const { isPro, profile } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [busy, setBusy] = React.useState('');
  const [error, setError] = React.useState('');

  const checkoutState = params.get('checkout');

  const startCheckout = async () => {
    setBusy('checkout'); setError('');
    try {
      const { url } = await invokeFunction('stripe-checkout');
      window.location.href = url;
    } catch (e) { setError(e.message); setBusy(''); }
  };

  const openPortal = async () => {
    setBusy('portal'); setError('');
    try {
      const { url } = await invokeFunction('stripe-portal');
      window.location.href = url;
    } catch (e) { setError(e.message); setBusy(''); }
  };

  return (
    <>
      <button onClick={() => navigate('/app/settings')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', padding: 0 }}>
        <ArrowLeft size={16} /> Settings
      </button>

      <PageHeader title="Plan & billing" subtitle="Upgrade to unlock the full DeadlineMate." />

      {checkoutState === 'success' && (
        <div style={{ padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-lg)', background: 'var(--urg-low-soft)', color: 'var(--tone-success-text)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          🎉 Your trial has started — welcome to Pro! It may take a few seconds to reflect here.
        </div>
      )}
      {checkoutState === 'cancelled' && (
        <div style={{ padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-lg)', background: 'var(--panel-2)', color: 'var(--ink-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Checkout cancelled — no charge was made.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', maxWidth: 720 }}>
        {/* Free */}
        <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', background: 'var(--panel)', padding: '1.6rem' }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Free</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.4rem 0', fontFamily: 'var(--font-display)' }}>£0</div>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.86rem', margin: '0 0 1rem' }}>Everything to never miss a deadline.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['Unlimited deadlines & courses', 'Email reminders', 'Calendar view', 'One calendar import'].map((f) => <Li key={f}>{f}</Li>)}
          </ul>
          {!isPro && <div style={{ marginTop: '1.4rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>Your current plan</div>}
        </div>

        {/* Pro */}
        <div style={{ border: '1.5px solid var(--accent)', borderRadius: 'var(--radius-xl)', background: 'var(--panel)', padding: '1.6rem', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ position: 'absolute', top: '1.6rem', right: '1.4rem', color: 'var(--accent)' }}><Sparkles size={20} /></div>
          <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Pro</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.4rem 0', fontFamily: 'var(--font-display)' }}>£3.49<span style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', fontWeight: 500 }}>/mo</span></div>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.86rem', margin: '0 0 1rem' }}>14-day free trial. Cancel anytime.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {PRO_FEATURES.map((f) => <Li key={f}>{f}</Li>)}
          </ul>
          <div style={{ marginTop: '1.4rem' }}>
            {isPro ? (
              <Button variant="secondary" full onClick={openPortal} disabled={busy === 'portal'}>{busy === 'portal' ? 'Opening…' : 'Manage subscription'}</Button>
            ) : (
              <Button variant="accent" full onClick={startCheckout} disabled={busy === 'checkout'}>{busy === 'checkout' ? 'Redirecting…' : 'Start 14-day free trial'}</Button>
            )}
          </div>
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.86rem', marginTop: '1.2rem' }}>{error}</p>}
      {isPro && <p style={{ color: 'var(--ink-faint)', fontSize: '0.82rem', marginTop: '1.4rem' }}>Plan status: {profile?.plan}. Manage or cancel anytime via the billing portal.</p>}
    </>
  );
}

function Li({ children }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
      <Check size={16} style={{ color: 'var(--urg-low)', flexShrink: 0, marginTop: 2 }} /> {children}
    </li>
  );
}
