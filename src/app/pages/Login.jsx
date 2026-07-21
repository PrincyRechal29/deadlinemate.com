import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/AuthProvider.jsx';
import Button from '../../components/ui/Button.jsx';

const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

export default function Login() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/app';

  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (session) navigate(from, { replace: true });
  }, [session, from, navigate]);

  const callback = `${APP_URL}/app/auth/callback`;

  const signInGoogle = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callback },
    });
    if (error) setError(error.message);
  };

  const sendMagicLink = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: callback },
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1.5rem', background: 'var(--page)' }}>
      <div className="dm-aura" aria-hidden />
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none', marginBottom: '2rem' }}>
          <span style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--accent)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>D</span>
          <span style={{ fontWeight: 650, color: 'var(--ink)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>DeadlineMate</span>
        </Link>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-2xl)', padding: '2rem 1.8rem', boxShadow: 'var(--shadow-md)' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.4rem', margin: '0 0 0.6rem' }}>Check your inbox</h1>
              <p style={{ color: 'var(--ink-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                We sent a magic sign-in link to <strong style={{ color: 'var(--ink)' }}>{email}</strong>. Click it to log in — no password needed.
              </p>
              <button onClick={() => setSent(false)} style={{ marginTop: '1.2rem', background: 'none', border: 'none', color: 'var(--accent-deep)', cursor: 'pointer', fontSize: '0.88rem' }}>
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Welcome back</h1>
              <p style={{ color: 'var(--ink-muted)', fontSize: '0.92rem', margin: '0 0 1.5rem' }}>Sign in to keep every deadline in one calm place.</p>

              <Button variant="secondary" full onClick={signInGoogle} style={{ marginBottom: '1rem' }}>
                <GoogleIcon /> Continue with Google
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: '1rem 0', color: 'var(--ink-faint)', fontSize: '0.78rem' }}>
                <span style={{ flex: 1, height: 1, background: 'var(--line)' }} /> or <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              </div>

              <form onSubmit={sendMagicLink}>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  style={inputStyle}
                />
                <Button as="button" type="submit" variant="accent" full disabled={busy} style={{ marginTop: '0.8rem' }}>
                  {busy ? 'Sending…' : 'Email me a magic link'}
                </Button>
              </form>

              {error && <p style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: '0.9rem' }}>{error}</p>}
            </>
          )}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '1.3rem' }}>
          By continuing you agree to our terms & privacy policy.
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', height: 46, padding: '0 0.9rem', borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--line-strong)', background: 'var(--panel)', color: 'var(--ink)',
  fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
};

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" style={{ marginRight: 2 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
