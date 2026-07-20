import React from 'react';
import { Logo } from './ui/Logo.jsx';

const cols = [
  ['Product', [['Features', '#features'], ['Product tour', '#product'], ['Pricing', '#pricing'], ['FAQ', '#faq']]],
  ['Company', [['About', '#'], ['Blog', '#'], ['Careers', '#'], ['Contact', '#']]],
  ['Legal', [['Privacy', '#'], ['Terms', '#'], ['Cookies', '#'], ['Status', '#']]],
];

export default function Footer() {
  return (
    <footer className="dm-invert" style={{ background: 'var(--page)', padding: '64px 0 40px' }}>
      <div className="dm-wrap dm-footer-grid">
        <div>
          <Logo size={32} />
          <p style={{ margin: '18px 0 0', maxWidth: '19rem', fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--ink-muted)' }}>
            Deadline planning, study focus, reminders, and progress tracking for modern students.
          </p>
        </div>
        {cols.map(([t, links]) => (
          <div key={t}>
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>{t}</p>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {links.map(([l, href]) => <a key={l} href={href} className="quiet-link" style={{ fontSize: '0.88rem' }}>{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div className="dm-wrap" style={{ marginTop: 52, paddingTop: 24, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.82rem', color: 'var(--ink-faint)' }}>
        <p style={{ margin: 0 }}>© 2026 DeadlineMate. All rights reserved.</p>
        <p style={{ margin: 0 }}>Made for students, by students.</p>
      </div>
      {/* Giant fading wordmark — the page's closing watermark */}
      <div className="dm-watermark" aria-hidden>DeadlineMate</div>
    </footer>
  );
}
