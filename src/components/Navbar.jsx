import React from 'react';
import { Logo } from './ui/Logo.jsx';
import { Button } from './ui/Button.jsx';
import { Icons } from './ui/icons.jsx';

export default function Navbar({ onCta }) {
  const [open, setOpen] = React.useState(false);
  const links = [
    ['Features', '#features'],
    ['Product', '#product'],
    ['Pricing', '#pricing'],
    ['FAQ', '#faq'],
  ];
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '14px 0' }}>
      <div className="dm-wrap">
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58, padding: '0 10px 0 18px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 8px 24px -16px rgba(10,10,11,0.18)' }}>
          <a href="#" style={{ textDecoration: 'none' }}><Logo size={30} /></a>
          <div style={{ display: 'flex', gap: 30 }} className="dm-navlinks">
            {links.map(([l, href]) => (
              <a key={l} href={href} className="nav-link" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a href="#" className="dm-signin nav-link" style={{ fontSize: '0.9rem', fontWeight: 550 }}>Sign in</a>
            <Button variant="primary" size="sm" onClick={onCta}>Start free</Button>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="dm-burger"
              style={{ placeItems: 'center', width: 40, height: 40, borderRadius: 'var(--radius-pill)', cursor: 'pointer', color: 'var(--ink)', background: 'transparent', border: '1px solid var(--line)' }}
            >
              {open ? <Icons.X size={17} /> : <Icons.Menu size={17} />}
            </button>
          </div>
        </nav>
        {open && (
          <div className="dm-mobile-menu" style={{ marginTop: 8, borderRadius: 'var(--radius-xl)', border: '1px solid var(--line)', background: 'var(--panel-solid)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 18px 16px' }}>
              {links.map(([l, href]) => (
                <a key={l} href={href} onClick={() => setOpen(false)} style={{ padding: '13px 4px', fontSize: '1rem', fontWeight: 550, color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--line-soft)' }}>{l}</a>
              ))}
              <a href="#" style={{ padding: '13px 4px', fontSize: '1rem', fontWeight: 550, color: 'var(--ink-muted)', textDecoration: 'none' }}>Sign in</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
