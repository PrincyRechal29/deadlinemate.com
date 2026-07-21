import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import Spinner from '../components/Spinner.jsx';

// Supabase-js (detectSessionInUrl + PKCE) exchanges the code automatically on
// load. We just wait for a session, then send the user into the app.
export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let done = false;
    const finish = () => { if (!done) { done = true; navigate('/app', { replace: true }); } };

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) finish();
    });
    const timer = setTimeout(() => {
      if (!done) setError('Sign-in link expired or invalid. Please try again.');
    }, 8000);
    return () => { sub.subscription.unsubscribe(); clearTimeout(timer); };
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      {error ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
          <a href="/login" style={{ color: 'var(--accent-deep)' }}>Back to sign in</a>
        </div>
      ) : (
        <Spinner label="Signing you in…" />
      )}
    </div>
  );
}
