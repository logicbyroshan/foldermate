import React from 'react';

const LOGOS = [
  { icon: '⭐', name: 'GitHub Stars', href: 'https://github.com/logicbyroshan/foldermate' },
  { icon: '💼', name: 'LinkedIn', href: '#' },
  { icon: '🐦', name: 'X / Twitter', href: '#' },
  { icon: '📰', name: 'Dev.to Blog', href: '#' },
  { icon: '🎨', name: 'Design Studios', href: '#' },
];

export default function TrustedBy() {
  return (
    <section className="trusted-section">
      <div className="trusted-inner">
        <div className="trusted-label">
          Trusted by studios,<br />
          freelancers &amp; agencies
        </div>
        <div className="trusted-logos">
          {LOGOS.map((l) => (
            <a key={l.name} href={l.href} target="_blank" rel="noreferrer" className="trusted-logo">
              <span style={{ fontSize: '1.2rem' }}>{l.icon}</span>
              {l.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
