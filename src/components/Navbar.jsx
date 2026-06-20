import React from 'react';
import { Logo } from './ui/Logo.jsx';
import { Button } from './ui/Button.jsx';
import { Icons } from './ui/icons.jsx';

export default function Navbar({ onCta }) {
  const [prog, setProg] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setProg(h.scrollTop / (h.scrollHeight - h.clientHeight || 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    ['Features', '#features'],
    ['Product', '#product'],
    ['Pricing', '#pricing'],
    ['FAQ', '#faq'],
  ];
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, width: `${prog * 100}%`, background: 'var(--grad-accent)', transition: 'width 0.1s linear' }} />
      <nav className="dm-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 }}>
        <a href="#" style={{ textDecoration: 'none' }}><Logo size={36} /></a>
        <div style={{ display: 'flex', gap: 34 }} className="dm-navlinks">
          {links.map(([l, href]) => (
            <a key={l} href={href} className="nav-link" style={{ fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="#" className="dm-signin" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink-soft)', textDecoration: 'none' }}>Sign in</a>
          <Button variant="primary" size="sm" iconRight={<Icons.ArrowRight size={15} />} onClick={onCta}>Start free</Button>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            style={{ display: 'none', placeItems: 'center', width: 40, height: 40, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', color: 'var(--ink)' }}
            className="dm-burger"
          >
            {open ? <Icons.X size={18} /> : <Icons.Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="dm-mobile-menu" style={{ borderTop: '1px solid var(--line)', background: 'var(--surface)' }}>
          <div className="dm-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 28px 20px' }}>
            {links.map(([l, href]) => (
              <a key={l} href={href} onClick={() => setOpen(false)} style={{ padding: '12px 4px', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--line)' }}>{l}</a>
            ))}
            <a href="#" style={{ padding: '12px 4px', fontSize: '1rem', fontWeight: 600, color: 'var(--ink-soft)', textDecoration: 'none' }}>Sign in</a>
          </div>
        </div>
      )}
    </header>
  );
}
