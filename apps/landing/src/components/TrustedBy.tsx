import React from 'react';

const LOGOS = [
  { icon: '⭐', name: 'GitHub Stars', href: 'https://github.com/logicbyroshan/foldermate' },
  { icon: '💼', name: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: '🐦', name: 'X / Twitter', href: 'https://x.com' },
  { icon: '📰', name: 'Dev.to Guides', href: 'https://dev.to' },
  { icon: '🎨', name: 'Design Studios', href: '#reviews' },
];

export default function TrustedBy() {
  return (
    <section className="trusted-section">
      <div className="container">
        <div className="trusted-inner">
          <div className="trusted-label">
            Trusted by studios, freelancers &amp; print agencies
          </div>
          <div className="trusted-logos">
            {LOGOS.map((l) => (
              <a
                key={l.name}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="trusted-logo"
              >
                <span>{l.icon}</span>
                <span>{l.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
