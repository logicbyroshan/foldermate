import React from 'react';

const BENEFITS = [
  {
    icon: '🔒',
    title: '100% Offline — Zero Cloud',
    body: 'FolderMate runs entirely on your machine. No telemetry, no cloud upload, no subscription. Your files never leave your computer.',
  },
  {
    icon: '⚡',
    title: 'Windows-Native Engine',
    body: 'Built on Node.js with a real Windows file-watcher, named-pipe IPC, and CorelDRAW COM adapter. No web wrappers — real system-level integration.',
  },
  {
    icon: '🆓',
    title: 'Free & Open Source',
    body: 'Star the repo, leave a comment, or follow on social — that\'s all it takes to get your Community License Key. No credit card, no trial limit.',
  },
];

export default function BenefitsSection() {
  return (
    <section className="benefits-section" id="how-it-works">
      <div className="container">
        <h2>Built with your experience<br />in mind</h2>
      </div>
      <div className="benefits-grid" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        {BENEFITS.map((b) => (
          <div key={b.title} className="benefit-card">
            <span className="benefit-icon">{b.icon}</span>
            <h3>{b.title}</h3>
            <p>{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
