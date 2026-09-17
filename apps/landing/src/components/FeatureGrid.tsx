import React from 'react';

const FEATURES = [
  {
    icon: '📁',
    badge: 'AUTOMATIC DETECTION',
    title: 'Auto-Classify by Client & Year',
    description:
      'FolderMate scans incoming filenames to identify client names, projects, categories, and years using smart rules and aliases. No manual tagging or sorting required.',
  },
  {
    icon: '🔢',
    badge: 'REVISION CONTROL',
    title: 'Smart Auto-Versioning',
    description:
      'Every file automatically receives a clean version suffix (v1, v2, v3...) stored in local SQLite metadata. Never overwrite previous artwork or lose project history.',
  },
  {
    icon: '🔍',
    badge: 'CONFIDENCE ENGINE',
    title: 'Safe Review Queue',
    description:
      'Low-confidence or ambiguous filenames are held in the Review Queue. You review and assign with one click, ensuring nothing ever moves without your approval.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="feature-grid-section" id="features">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="star-badge" style={{ marginBottom: 12 }}>
            <span>⚡</span> CORE INGESTION ENGINE
          </div>
          <h2>All organization options at your fingertips.</h2>
          <p className="section-sub">
            FolderMate handles the tedious work of classifying, renaming, and filing your creative assets so you can focus entirely on design.
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card-top">
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-badge">{f.badge}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
