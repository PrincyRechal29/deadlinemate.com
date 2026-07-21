import React from 'react';
import { supabase } from './supabase.js';

const AuthCtx = React.createContext({ session: null, user: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [session, setSession] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const loadProfile = React.useCallback(async (userId) => {
    if (!userId) { setProfile(null); return; }
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    setProfile(data ?? null);
  }, []);

  React.useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session?.user?.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      await loadProfile(s?.user?.id);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [loadProfile]);

  const refreshProfile = React.useCallback(
    () => loadProfile(session?.user?.id),
    [loadProfile, session],
  );

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    isPro: profile?.plan === 'pro' || profile?.plan === 'campus',
    refreshProfile,
    signOut,
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return React.useContext(AuthCtx);
}
