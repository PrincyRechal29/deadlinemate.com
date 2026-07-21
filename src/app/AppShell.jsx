import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, BookOpen, Users, DownloadCloud, Settings as SettingsIcon, LogOut, Sparkles, Menu, X } from 'lucide-react';
import { useAuth } from './lib/AuthProvider.jsx';

const NAV = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/app/courses', label: 'Courses', icon: BookOpen },
  { to: '/app/classes', label: 'Shared classes', icon: Users },
  { to: '/app/import', label: 'Import', icon: DownloadCloud },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
];

export default function AppShell() {
  const { profile, user, signOut, isPro } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // First-run onboarding gate.
  React.useEffect(() => {
    if (profile && !profile.onboarded && !location.pathname.startsWith('/app/onboarding')) {
      navigate('/app/onboarding', { replace: true });
    }
  }, [profile, location.pathname, navigate]);

  React.useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const initials = (profile?.display_name || user?.email || '?').slice(0, 1).toUpperCase();

  const sidebar = (
    <aside
      style={{
        width: 244, flexShrink: 0, borderRight: '1px solid var(--line)', background: 'var(--panel)',
        padding: '1.4rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
        position: 'sticky', top: 0, height: '100vh',
      }}
    >
      <NavLink to="/app" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none', padding: '0.2rem 0.6rem 1.1rem' }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--accent)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>D</span>
        <span style={{ fontWeight: 650, color: 'var(--ink)', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>DeadlineMate</span>
      </NavLink>

      {NAV.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem 0.75rem',
            borderRadius: 'var(--radius-md)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
            color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
            background: isActive ? 'var(--panel-2)' : 'transparent',
          })}
        >
          <Icon size={18} strokeWidth={1.9} />
          {label}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {!isPro && (
          <NavLink to="/app/settings/billing" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 0.8rem',
            borderRadius: 'var(--radius-md)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 550,
            color: 'var(--accent-deep)', background: 'var(--accent-soft)',
          }}>
            <Sparkles size={16} /> Upgrade to Pro
          </NavLink>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.6rem', borderTop: '1px solid var(--line-soft)', paddingTop: '0.9rem' }}>
          <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.8rem', fontWeight: 600 }}>{initials}</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 550, color: 'var(--ink)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{profile?.display_name || 'You'}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-faint)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{isPro ? 'Pro plan' : 'Free plan'}</div>
          </div>
          <button onClick={signOut} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', padding: 4 }}>
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--page-2)' }}>
      {/* Desktop sidebar */}
      <div className="dm-sidebar-desktop">{sidebar}</div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.3)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0 }}>{sidebar}</div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile top bar */}
        <div className="dm-topbar-mobile" style={{
          display: 'none', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.8rem 1rem', borderBottom: '1px solid var(--line)', background: 'var(--panel)', position: 'sticky', top: 0, zIndex: 40,
        }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
          <span style={{ fontWeight: 650, fontFamily: 'var(--font-display)' }}>DeadlineMate</span>
          <span style={{ width: 24 }} />
        </div>

        <main style={{ flex: 1, padding: 'clamp(1.1rem, 3vw, 2.2rem)', maxWidth: 1080, width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .dm-sidebar-desktop { display: block; }
        @media (max-width: 820px) {
          .dm-sidebar-desktop { display: none; }
          .dm-topbar-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
