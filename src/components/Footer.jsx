import React from 'react';
import { Logo } from './ui/Logo.jsx';
import { Icons } from './ui/icons.jsx';

const cols = [
  ['Product', [['Features', '#features'], ['Product tour', '#product'], ['Pricing', '#pricing'], ['FAQ', '#faq']]],
  ['Company', [['About', '#'], ['Blog', '#'], ['Careers', '#'], ['Contact', '#']]],
  ['Legal', [['Privacy', '#'], ['Terms', '#'], ['Cookies', '#'], ['Status', '#']]],
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--surface)', padding: '64px 0 36px' }}>
      <div className="dm-wrap dm-footer-grid">
        <div>
          <Logo size={38} />
          <p style={{ margin: '20px 0 0', maxWidth: '20rem', lineHeight: 1.7, color: 'var(--ink-muted)' }}>
            Deadline planning, study focus, reminders, and progress tracking for modern students.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            {[Icons.MessageSquare, Icons.Mail, Icons.Users].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink-soft)' }}>
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
        {cols.map(([t, links]) => (
          <div key={t}>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--ink-faint)' }}>{t}</p>
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
              {links.map(([l, href]) => <a key={l} href={href} className="nav-link" style={{ fontSize: '0.9rem', textDecoration: 'none' }}>{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div className="dm-wrap" style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
        <p style={{ margin: 0 }}>© 2026 DeadlineMate. All rights reserved.</p>
        <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.04em' }}>Made for students, by students.</p>
      </div>
    </footer>
  );
}
