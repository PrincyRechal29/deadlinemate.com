import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthProvider.jsx';
import { useUpdateProfile } from '../lib/api.js';
import { guessTimezone } from '../lib/dates.js';
import { Field, fieldStyle } from '../components/ui.jsx';
import Button from '../../components/ui/Button.jsx';

const OFFSET_CHOICES = [
  { label: '1 week before', value: '1w' },
  { label: '3 days before', value: '3d' },
  { label: '1 day before', value: '1d' },
  { label: '3 hours before', value: '3h' },
  { label: '1 hour before', value: '1h' },
];

export default function Onboarding() {
  const { profile, refreshProfile } = useAuth();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();

  const [name, setName] = React.useState(profile?.display_name || '');
  const [tz, setTz] = React.useState(profile?.timezone && profile.timezone !== 'UTC' ? profile.timezone : guessTimezone());
  const [offsets, setOffsets] = React.useState(new Set(['1d', '3h']));
  const [busy, setBusy] = React.useState(false);

  const toggle = (v) => setOffsets((s) => {
    const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); return n;
  });

  const finish = async () => {
    setBusy(true);
    const ordered = OFFSET_CHOICES.map((o) => o.value).filter((v) => offsets.has(v));
    await updateProfile.mutateAsync({
      display_name: name.trim() || null,
      timezone: tz,
      reminder_offsets: ordered.length ? ordered : ['1d'],
      onboarded: true,
    });
    await refreshProfile();
    navigate('/app', { replace: true });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1.5rem', background: 'var(--page-2)' }}>
      <div style={{ width: '100%', maxWidth: 460, background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-2xl)', padding: '2rem 1.9rem', boxShadow: 'var(--shadow-md)' }}>
        <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Let's set you up</h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '0.92rem', margin: '0 0 1.6rem' }}>Two quick things so your reminders land at the right time.</p>

        <Field label="What should we call you?">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex" style={fieldStyle} />
        </Field>

        <Field label="Your timezone">
          <input value={tz} onChange={(e) => setTz(e.target.value)} style={fieldStyle} />
          <span style={{ fontSize: '0.76rem', color: 'var(--ink-faint)' }}>Detected: {guessTimezone()}</span>
        </Field>

        <div style={{ marginBottom: '0.5rem', fontSize: '0.82rem', fontWeight: 550, color: 'var(--ink-soft)' }}>When should we remind you?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {OFFSET_CHOICES.map((o) => {
            const on = offsets.has(o.value);
            return (
              <button key={o.value} onClick={() => toggle(o.value)} style={{
                padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 500,
                border: `1px solid ${on ? 'var(--accent)' : 'var(--line-strong)'}`,
                background: on ? 'var(--accent-soft)' : 'var(--panel)', color: on ? 'var(--accent-deep)' : 'var(--ink-muted)',
              }}>{o.label}</button>
            );
          })}
        </div>

        <Button variant="accent" full disabled={busy} onClick={finish}>{busy ? 'Saving…' : 'Start planning'}</Button>
      </div>
    </div>
  );
}
