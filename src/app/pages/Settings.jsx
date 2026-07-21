import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider.jsx';
import { useUpdateProfile, useNotificationLog } from '../lib/api.js';
import { pushSupported, enablePush, disablePush, pushEnabledHere } from '../lib/push.js';
import { guessTimezone, fmtDue } from '../lib/dates.js';
import { PageHeader, Field, fieldStyle } from '../components/ui.jsx';
import Button from '../../components/ui/Button.jsx';

const OFFSETS = [
  { label: '1 week', value: '1w' }, { label: '3 days', value: '3d' },
  { label: '1 day', value: '1d' }, { label: '3 hours', value: '3h' }, { label: '1 hour', value: '1h' },
];

export default function Settings() {
  const { profile, isPro, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const { data: log = [] } = useNotificationLog();

  const [name, setName] = React.useState(profile?.display_name || '');
  const [tz, setTz] = React.useState(profile?.timezone || guessTimezone());
  const [offsets, setOffsets] = React.useState(new Set(profile?.reminder_offsets || ['1d', '3h']));
  const [channels, setChannels] = React.useState(new Set(profile?.reminder_channels || ['email']));
  const [saved, setSaved] = React.useState(false);
  const [pushOn, setPushOn] = React.useState(false);
  const [pushBusy, setPushBusy] = React.useState(false);
  const [pushErr, setPushErr] = React.useState('');

  React.useEffect(() => { pushEnabledHere().then(setPushOn); }, []);

  const toggleSet = (setter) => (v) => setter((s) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); return n; });

  const save = async () => {
    const ordered = OFFSETS.map((o) => o.value).filter((v) => offsets.has(v));
    const chs = ['email', 'push', 'sms'].filter((c) => channels.has(c));
    await updateProfile.mutateAsync({
      display_name: name.trim() || null, timezone: tz,
      reminder_offsets: ordered.length ? ordered : ['1d'],
      reminder_channels: chs.length ? chs : ['email'],
    });
    await refreshProfile();
    setSaved(true); setTimeout(() => setSaved(false), 1800);
  };

  const togglePush = async () => {
    setPushBusy(true); setPushErr('');
    try {
      if (pushOn) { await disablePush(); setPushOn(false); }
      else { await enablePush(); setPushOn(true); }
    } catch (e) { setPushErr(e.message); }
    setPushBusy(false);
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Control your profile and how we remind you." />

      <Section title="Profile">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <Field label="Display name"><input value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} /></Field>
          <Field label="Timezone"><input value={tz} onChange={(e) => setTz(e.target.value)} style={fieldStyle} /></Field>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--ink-faint)' }}>Signed in as {profile?.email}</div>
      </Section>

      <Section title="When to remind me" hint="We'll schedule a reminder at each selected time before a deadline.">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {OFFSETS.map((o) => <Chip key={o.value} on={offsets.has(o.value)} onClick={() => toggleSet(setOffsets)(o.value)}>{o.label} before</Chip>)}
        </div>
      </Section>

      <Section title="How to remind me">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Chip on={channels.has('email')} onClick={() => toggleSet(setChannels)('email')}>Email</Chip>
          <Chip on={channels.has('push')} disabled={!isPro} onClick={() => isPro && toggleSet(setChannels)('push')}>
            Push {!isPro && '· Pro'}
          </Chip>
          <Chip on={channels.has('sms')} disabled={!isPro} onClick={() => isPro && toggleSet(setChannels)('sms')}>
            SMS {!isPro && '· Pro'}
          </Chip>
        </div>
        {!isPro && (
          <div style={{ marginTop: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-deep)' }}>
            <Sparkles size={15} /> <button onClick={() => navigate('/app/settings/billing')} style={{ ...linkBtn, color: 'var(--accent-deep)', fontWeight: 550 }}>Upgrade to Pro</button> for push & SMS reminders.
          </div>
        )}
      </Section>

      {channels.has('push') && (
        <Section title="Push on this device">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--ink-muted)' }}>
              {pushSupported() ? (pushOn ? 'This device will receive push reminders.' : 'Enable push on this browser/device.') : 'Push isn\'t supported in this browser.'}
            </div>
            <Button variant={pushOn ? 'secondary' : 'accent'} iconLeft={pushOn ? <BellOff size={15} /> : <Bell size={15} />} disabled={!pushSupported() || pushBusy} onClick={togglePush}>
              {pushBusy ? '…' : pushOn ? 'Disable' : 'Enable'}
            </Button>
          </div>
          {pushErr && <p style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: '0.6rem' }}>{pushErr}</p>}
        </Section>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', margin: '0.5rem 0 2rem' }}>
        <Button variant="accent" onClick={save} disabled={updateProfile.isPending}>{updateProfile.isPending ? 'Saving…' : 'Save changes'}</Button>
        {saved && <span style={{ color: 'var(--tone-success-text)', fontSize: '0.88rem' }}>Saved ✓</span>}
      </div>

      <Section title="Plan & billing">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
            You're on the <strong style={{ color: 'var(--ink)' }}>{isPro ? 'Pro' : 'Free'}</strong> plan.
          </div>
          <Button variant="secondary" iconRight={<ExternalLink size={14} />} onClick={() => navigate('/app/settings/billing')}>Manage</Button>
        </div>
      </Section>

      <Section title="Recent notifications" hint="The last reminders we sent you.">
        {log.length === 0 ? (
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>No reminders sent yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {log.slice(0, 8).map((n) => (
              <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--ink-muted)', padding: '0.35rem 0' }}>
                <span>{n.channel} · <span style={{ color: n.status === 'sent' ? 'var(--tone-success-text)' : 'var(--danger)' }}>{n.status}</span></span>
                <span>{fmtDue(n.created_at, tz)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

function Section({ title, hint, children }) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', background: 'var(--panel)', padding: '1.4rem 1.5rem', marginBottom: '1.2rem' }}>
      <h3 style={{ fontSize: '0.98rem', margin: '0 0 0.3rem' }}>{title}</h3>
      {hint && <p style={{ fontSize: '0.82rem', color: 'var(--ink-faint)', margin: '0 0 1rem' }}>{hint}</p>}
      {!hint && <div style={{ height: '0.8rem' }} />}
      {children}
    </div>
  );
}

function Chip({ on, disabled, onClick, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '0.5rem 0.95rem', borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '0.84rem', fontWeight: 500, opacity: disabled ? 0.55 : 1,
      border: `1px solid ${on ? 'var(--accent)' : 'var(--line-strong)'}`,
      background: on ? 'var(--accent-soft)' : 'var(--panel)', color: on ? 'var(--accent-deep)' : 'var(--ink-muted)',
    }}>{children}</button>
  );
}

const linkBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' };
