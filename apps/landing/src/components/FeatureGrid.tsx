import React from 'react';

const FEATURES = [
  {
    icon: '📁',
    title: 'Auto-Classify',
    description:
      'FolderMate reads the filename and detects client, project, category, and year using smart rules and aliases — no manual tagging needed.',
  },
  {
    icon: '🔢',
    title: 'Smart Versioning',
    description:
      'Every file gets a version suffix (v1, v2, v3...) tracked in SQLite. Never lose a previous version — full audit history always available.',
  },
  {
    icon: '🔍',
    title: 'Review Queue',
    description:
      'Low-confidence files are routed to a Review Queue so nothing gets lost. You review, confirm, and approve — the engine does the rest.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="feature-grid-section" id="features">
      <div className="container">
        <h2>All Organization Options<br />at your fingertips</h2>
      </div>
      <div className="feature-grid" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
