import React from 'react';

function MockCard({ dark, compact }: { dark?: boolean; compact?: boolean }) {
  const rows = [
    { ext: 'CDR', name: 'ABC School ID Card 2026 v8', badge: 'v8', color: '#d97706' },
    { ext: 'PDF', name: 'Apex Healthcare Brochure v3', badge: 'v3', color: '#dc2626' },
    { ext: 'AI',  name: 'Zenith Corp Lanyard 2025 v1', badge: 'v1', color: '#ea580c' },
    { ext: 'PSD', name: 'City Gala Event Poster v2', badge: 'v2', color: '#2563eb' },
  ];

  return (
    <div
      className={`hero-mock ${dark ? 'hero-mock-dark hero-mock-side' : 'hero-mock-light hero-mock-center'}`}
    >
      <div className={`mock-titlebar ${dark ? 'mock-titlebar-dark' : 'mock-titlebar-light'}`}>
        <div className="mock-dot mock-dot-red" />
        <div className="mock-dot mock-dot-yellow" />
        <div className="mock-dot mock-dot-green" />
        <span className="mock-titlebar-text">
          {dark ? 'Review Queue (Pending)' : 'FolderMate — Ingestion Pipeline'}
        </span>
      </div>
      <div className="mock-body">
        {(dark ? rows.slice(0, 2) : rows).map((r, i) => (
          <div key={i} className={`mock-row ${dark ? 'mock-row-dark' : 'mock-row-light'}`}>
            <span className="mock-ext" style={{ background: r.color }}>{r.ext}</span>
            <span className="mock-filename">{r.name}</span>
            <span className={`mock-badge ${i === 0 ? 'mock-badge-amber' : ''}`}>{r.badge}</span>
          </div>
        ))}
        {!dark && (
          <div className="mock-sandbox-notice">
            <span style={{ fontSize: '1rem' }}>⚡</span>
            <span><strong>Ingestion Active:</strong> Watching <code>Inbox/</code> folder · Auto-classified with 98% confidence</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">
        {/* Star badge */}
        <div className="animate-fade-up hero-top-badge-wrap">
          <div className="star-badge">
            <span>⭐</span> Open-source & free forever — give it a star!
          </div>
        </div>

        {/* Headline with guaranteed single-line "organized — automatically." */}
        <h1 className="hero-headline animate-fade-up delay-1">
          <span className="hero-title-top">Your design files,</span>
          <span className="hero-title-highlight">organized — automatically.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-sub animate-fade-up delay-2">
          Drop CDR, AI, PSD, and PDF files into your Inbox. FolderMate classifies, renames,
          versions, and moves them — all offline, all hands-free.
        </p>

        {/* CTA Buttons */}
        <div className="hero-ctas animate-fade-up delay-3">
          <a href="#download" className="btn btn-primary btn-lg">
            <span>📥</span> FREE DOWNLOAD
          </a>
          <a
            href="https://github.com/logicbyroshan/foldermate"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-lg"
          >
            <span>⭐</span> View on GitHub
          </a>
        </div>

        {/* Speech-bubble badges */}
        <div className="hero-badges animate-fade-up delay-4">
          <div className="hero-badge">✨ Better named files</div>
          <div className="hero-badge">🔄 Auto versioned (v1, v2)</div>
          <div className="hero-badge">⚡ 100% Offline & Private</div>
        </div>

        {/* App mockup cards */}
        <div className="hero-mockups animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <MockCard dark />
          <MockCard />
          <MockCard dark />
        </div>
      </div>
    </section>
  );
}
