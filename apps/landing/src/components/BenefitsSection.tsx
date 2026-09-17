import React from 'react';

const BENEFITS = [
  {
    icon: '🔒',
    badge: 'ZERO TELEMETRY',
    title: '100% Offline — Zero Cloud',
    body: 'FolderMate runs entirely on your local machine. No telemetry, no cloud uploads, and no monthly subscriptions. Your sensitive client files never leave your computer.',
  },
  {
    icon: '⚡',
    badge: 'SYSTEM INTEGRATION',
    title: 'Windows-Native Performance',
    body: 'Engineered specifically for Windows with native filesystem watchers, named-pipe IPC, SQLite in WAL mode, and direct CorelDRAW COM bridge integration.',
  },
  {
    icon: '🆓',
    badge: 'COMMUNITY DRIVEN',
    title: 'Free & Open Source Forever',
    body: 'Complete any 3 community tasks (Star on GitHub, read a guide, follow on social) to get your instant activation key. No credit cards, no paywalls, no trial limits.',
  },
];

export default function BenefitsSection() {
  return (
    <section className="benefits-section" id="benefits">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="star-badge" style={{ marginBottom: 12 }}>
            <span>⭐</span> WHY CHOOSE FOLDERMATE
          </div>
          <h2>Built with privacy and productivity in mind.</h2>
          <p className="section-sub">
            Designed from the ground up for print shops, design agencies, and freelance artists who demand speed and security.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid">
          {BENEFITS.map((b) => (
            <div key={b.title} className="benefit-card">
              <div className="benefit-card-top">
                <span className="benefit-icon">{b.icon}</span>
                <span className="benefit-badge">{b.badge}</span>
              </div>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
