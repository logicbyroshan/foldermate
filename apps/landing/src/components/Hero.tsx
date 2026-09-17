import React from 'react';

export default function Hero() {
  const rows = [
    {
      ext: 'CDR',
      color: '#d97706',
      name: 'ABC School Annual Sports ID Card 2026.cdr',
      client: 'ABC School',
      target: 'Clients/ABC School/2026/ID Cards/',
      ver: 'v8',
      status: 'Organized',
    },
    {
      ext: 'PDF',
      color: '#dc2626',
      name: 'Apex Healthcare Tri-Fold Brochure Draft.pdf',
      client: 'Apex Healthcare',
      target: 'Clients/Apex/Brochures/2026/',
      ver: 'v3',
      status: 'Organized',
    },
    {
      ext: 'AI',
      color: '#ea580c',
      name: 'Zenith Corp Conference Lanyard Design.ai',
      client: 'Zenith Corp',
      target: 'Clients/Zenith/Branding/',
      ver: 'v1',
      status: 'Organized',
    },
    {
      ext: 'PSD',
      color: '#2563eb',
      name: 'City Gala Charity Event Billboard 6x3m.psd',
      client: 'City Gala',
      target: 'Clients/City Gala/Events/2026/',
      ver: 'v2',
      status: 'Organized',
    },
  ];

  return (
    <section className="hero" id="hero">
      <div className="container hero-container">
        {/* Star badge */}
        <div className="animate-fade-up hero-top-badge-wrap">
          <div className="star-badge">
            <span>⭐</span> Open-source & free forever — give it a star!
          </div>
        </div>

        {/* Headline with guaranteed single-line 'organized — automatically.' */}
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
          <div className="hero-badge">⚡ 100% Offline &amp; Private</div>
        </div>

        {/* Compact, Unified Desktop App Window Preview */}
        <div className="hero-app-window animate-fade-up" style={{ animationDelay: '0.45s' }}>
          {/* Titlebar */}
          <div className="app-titlebar">
            <div className="window-dots">
              <div className="dot dot-red" />
              <div className="dot dot-yellow" />
              <div className="dot dot-green" />
            </div>
            <div className="window-title">
              <span>📁</span> FolderMate Desktop — Watch &amp; Classify Engine
            </div>
            <div className="window-status-pill">
              <span className="live-pulse" /> ENGINE ACTIVE
            </div>
          </div>

          {/* Window Body: Table of organized files */}
          <div className="app-table-wrap">
            <table className="app-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Type</th>
                  <th>Source File</th>
                  <th>Client / Project</th>
                  <th>Destination Folder</th>
                  <th style={{ width: '65px', textAlign: 'center' }}>Version</th>
                  <th style={{ width: '90px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="app-table-row">
                    <td>
                      <span className="ext-badge" style={{ background: row.color }}>
                        {row.ext}
                      </span>
                    </td>
                    <td>
                      <span className="file-name-text">{row.name}</span>
                    </td>
                    <td>
                      <span className="client-text">{row.client}</span>
                    </td>
                    <td>
                      <code className="path-text">{row.target}</code>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`version-pill ${idx === 0 ? 'version-pill-amber' : ''}`}>
                        {row.ver}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="status-pill">✓ Done</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Window Footer Status */}
          <div className="app-footer-bar">
            <div className="footer-status-left">
              <span>⚡ Watching <code>Inbox/</code> folder</span>
              <span>·</span>
              <span>4 files organized in 0.3s</span>
              <span>·</span>
              <span>Confidence: 98%</span>
            </div>
            <div className="footer-status-right">
              <span>🔒 100% Offline (SQLite WAL)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
