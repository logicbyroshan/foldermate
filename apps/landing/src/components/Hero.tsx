import React from 'react';

function MockCard({ dark }: { dark?: boolean }) {
  const rows = [
    { ext: 'CDR', name: 'ABC School ID Card 2026 v8', badge: 'v8', color: '#d97706' },
    { ext: 'PDF', name: 'Apex Healthcare Brochure v3', badge: 'v3', color: '#dc2626' },
    { ext: 'AI',  name: 'Zenith Corp Lanyard 2025 v1', badge: 'v1', color: '#ea580c' },
    { ext: 'PSD', name: 'City Gala Event Poster v2', badge: 'v2', color: '#2563eb' },
  ];

  return (
    <div
      className={`hero-mock ${dark ? 'hero-mock-dark' : 'hero-mock-light'}`}
      style={{ width: dark ? 200 : 460, height: dark ? 280 : 340, flexShrink: 0 }}
    >
      <div className={`mock-titlebar ${dark ? 'mock-titlebar-dark' : 'mock-titlebar-light'}`}>
        <div className="mock-dot mock-dot-red" />
        <div className="mock-dot mock-dot-yellow" />
        <div className="mock-dot mock-dot-green" />
        <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, opacity: 0.5 }}>
          {dark ? 'Review Queue' : 'FolderMate — Dashboard'}
        </span>
      </div>
      <div className="mock-body">
        {(dark ? rows.slice(0, 2) : rows).map((r, i) => (
          <div key={i} className={`mock-row ${dark ? 'mock-row-dark' : 'mock-row-light'}`}>
            <span className="mock-ext" style={{ background: r.color }}>{r.ext}</span>
            <span style={{ flex: 1, fontSize: 11, fontWeight: 500, opacity: dark ? 0.8 : 1 }}>{r.name}</span>
            <span className={`mock-badge ${i === 0 ? 'mock-badge-amber' : ''}`}>{r.badge}</span>
          </div>
        ))}
        {!dark && (
          <div style={{
            marginTop: 8, padding: '10px 10px', borderRadius: 8,
            background: 'rgba(232,155,0,0.12)', border: '1px dashed rgba(232,155,0,0.4)',
            fontSize: 11, fontWeight: 600, color: '#92640a'
          }}>
            ⚡ Ingestion Sandbox — drop a filename to test classification
          </div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="container" style={{ maxWidth: 1160 }}>
        {/* Star badge */}
        <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div className="star-badge">
            <span>⭐</span> Open-source & free forever — give it a star!
          </div>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-1">
          Your design files,<br />
          <em>organized — automatically.</em>
        </h1>

        {/* Subtitle */}
        <p className="hero-sub animate-fade-up delay-2">
          Drop files into your Inbox. FolderMate classifies, renames, versions, and moves them
          — all offline, all hands-free.
        </p>

        {/* CTA */}
        <div className="animate-fade-up delay-3" style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a href="#download" className="btn btn-primary btn-lg">FREE DOWNLOAD</a>
          <a
            href="https://github.com/logicbyroshan/foldermate"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-lg"
          >
            View on GitHub
          </a>
        </div>

        {/* Speech-bubble badges */}
        <div className="hero-badges animate-fade-up delay-4">
          <div className="hero-badge">Better named files</div>
          <div className="hero-badge">Auto versioned</div>
          <div className="hero-badge">No effort needed</div>
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
