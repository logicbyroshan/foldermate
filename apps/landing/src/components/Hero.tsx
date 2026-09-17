import React from 'react';

export default function Hero() {
  const fileRows = [
    {
      ext: 'CDR',
      color: '#d97706',
      name: 'ABC_School_Annual_Sports_ID_2026.cdr',
      client: 'ABC School',
      folder: 'Clients / ABC School / 2026 / ID Cards /',
      ver: 'v8',
      status: 'Organized',
    },
    {
      ext: 'PDF',
      color: '#dc2626',
      name: 'Apex_Healthcare_Brochure_Draft_Final.pdf',
      client: 'Apex Healthcare',
      folder: 'Clients / Apex / Brochures / 2026 /',
      ver: 'v3',
      status: 'Organized',
    },
    {
      ext: 'AI',
      color: '#ea580c',
      name: 'Zenith_Corp_Staff_Lanyard_2025.ai',
      client: 'Zenith Corp',
      folder: 'Clients / Zenith / Branding / 2025 /',
      ver: 'v1',
      status: 'Organized',
    },
    {
      ext: 'PSD',
      color: '#2563eb',
      name: 'City_Gala_Billboard_Charity_6x3m.psd',
      client: 'City Gala',
      folder: 'Clients / City Gala / Events / 2026 /',
      ver: 'v2',
      status: 'Organized',
    },
  ];

  return (
    <section className="hero" id="hero">
      {/* Background Decorative Animated Elements */}
      <div className="hero-bg-decorations" aria-hidden="true">
        {/* Floating Sticker: Inbox Watcher (Top Left) */}
        <div className="hero-floating-badge float-top-left">
          <div className="floating-sticker sticker-amber">
            <span className="sticker-icon">📁</span>
            <div className="sticker-content">
              <span className="sticker-title">Inbox Watcher</span>
              <span className="sticker-sub">Auto Ingestion</span>
            </div>
            <span className="sticker-pulse" />
          </div>
        </div>

        {/* Floating Sticker: Two-Phase Atomic (Top Right) */}
        <div className="hero-floating-badge float-top-right">
          <div className="floating-sticker sticker-white">
            <span className="sticker-icon">⚡</span>
            <div className="sticker-content">
              <span className="sticker-title">Atomic Move</span>
              <span className="sticker-sub">2-Phase Safety</span>
            </div>
          </div>
        </div>

        {/* Floating Pill: Verified Security (Mid Left) */}
        <div className="hero-floating-badge float-mid-left">
          <div className="floating-pill pill-green">
            <span>🔒 SHA-256 Verified</span>
          </div>
        </div>

        {/* Floating Pill: Supported Formats (Mid Right) */}
        <div className="hero-floating-badge float-mid-right">
          <div className="floating-pill pill-amber">
            <span>🎯 .CDR · .AI · .PSD · .PDF</span>
          </div>
        </div>

        {/* Neo-brutalist Animated Sparkle Stars */}
        <div className="deco-star star-tl">✦</div>
        <div className="deco-star star-tr">★</div>
        <div className="deco-star star-bl">✧</div>
        <div className="deco-star star-br">✦</div>
        <div className="deco-circle circle-1" />
        <div className="deco-circle circle-2" />
      </div>

      <div className="container hero-container">
        {/* Star badge */}
        <div className="animate-fade-up hero-top-badge-wrap">
          <div className="star-badge">
            <span>⭐</span> Open-source &amp; free forever — give it a star!
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

        {/* Full-Width Laptop Screen Display Mockup with proportional responsive scaling */}
        <div className="laptop-wrapper animate-fade-up" style={{ animationDelay: '0.45s' }}>
          <div className="laptop-device">
            {/* Top Display Lid with Camera */}
            <div className="laptop-screen-lid">
              <div className="laptop-camera-notch">
                <span className="camera-lens" />
              </div>

              {/* Inner Application Interface */}
              <div className="laptop-display-inner">
                {/* Simulated Desktop Window Chrome */}
                <div className="laptop-app-chrome">
                  <div className="window-dots">
                    <div className="dot dot-red" />
                    <div className="dot dot-yellow" />
                    <div className="dot dot-green" />
                  </div>
                  <span className="laptop-app-title">
                    FolderMate Desktop — Production File Classification Engine
                  </span>
                  <div className="laptop-app-badge">
                    <span className="live-pulse" /> ENGINE ACTIVE (OFFLINE)
                  </div>
                </div>

                {/* Main App Layout: Sidebar + Main Dashboard */}
                <div className="laptop-app-body">
                  {/* Left Sidebar (visible on desktop/laptop) */}
                  <aside className="laptop-sidebar">
                    <div className="laptop-sidebar-brand">
                      <div className="brand-icon">📁</div>
                      <div className="brand-text">
                        <strong>FolderMate</strong>
                        <span>v1.0.0</span>
                      </div>
                    </div>

                    <nav className="laptop-sidebar-nav">
                      <div className="nav-item active">
                        <span>📊</span> Dashboard
                      </div>
                      <div className="nav-item">
                        <span>📁</span> Rules &amp; Aliases
                      </div>
                      <div className="nav-item">
                        <span>🔍</span> Review Queue <span className="nav-badge">2</span>
                      </div>
                      <div className="nav-item">
                        <span>📑</span> Audit History
                      </div>
                      <div className="nav-item">
                        <span>⚙️</span> Settings
                      </div>
                    </nav>

                    <div className="laptop-sidebar-footer">
                      <div className="status-indicator">
                        <span className="status-dot green" />
                        <span>SQLite WAL Ready</span>
                      </div>
                    </div>
                  </aside>

                  {/* Right Dashboard Area */}
                  <main className="laptop-main-panel">
                    {/* Top Stats Cards Row */}
                    <div className="laptop-stats-grid">
                      <div className="laptop-stat-card">
                        <div className="stat-label">Total Organized</div>
                        <div className="stat-value">1,428</div>
                        <div className="stat-sub positive">↑ +18 today</div>
                      </div>
                      <div className="laptop-stat-card">
                        <div className="stat-label">Accuracy Score</div>
                        <div className="stat-value">98.4%</div>
                        <div className="stat-sub neutral">High confidence</div>
                      </div>
                      <div className="laptop-stat-card">
                        <div className="stat-label">Review Queue</div>
                        <div className="stat-value">2</div>
                        <div className="stat-sub warning">Needs review</div>
                      </div>
                      <div className="laptop-stat-card">
                        <div className="stat-label">Time Saved</div>
                        <div className="stat-value">34.5 hrs</div>
                        <div className="stat-sub positive">This month</div>
                      </div>
                    </div>

                    {/* Live Pipeline Notice */}
                    <div className="laptop-pipeline-notice">
                      <span className="notice-icon">⚡</span>
                      <div className="notice-text">
                        <strong>Live Watcher Active:</strong> Monitoring <code>C:\Studio\Inbox\</code>. 4 files processed instantly with atomic safety.
                      </div>
                    </div>

                    {/* Processed Files Table */}
                    <div className="laptop-table-container">
                      <table className="laptop-table">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }}>Type</th>
                            <th>Filename</th>
                            <th className="desktop-col">Client / Project</th>
                            <th className="desktop-col">Target Directory</th>
                            <th style={{ width: '50px', textAlign: 'center' }}>Ver</th>
                            <th style={{ width: '70px', textAlign: 'right' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fileRows.map((row, idx) => (
                            <tr key={idx}>
                              <td>
                                <span className="ext-pill" style={{ background: row.color }}>
                                  {row.ext}
                                </span>
                              </td>
                              <td className="filename-cell">
                                <span>{row.name}</span>
                              </td>
                              <td className="client-cell desktop-col">{row.client}</td>
                              <td className="path-cell desktop-col">
                                <code>{row.folder}</code>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span className={`ver-pill ${idx === 0 ? 'amber' : ''}`}>
                                  {row.ver}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <span className="done-pill">✓ Moved</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </main>
                </div>
              </div>
            </div>

            {/* Laptop Base Stand */}
            <div className="laptop-base-stand">
              <div className="laptop-base-notch" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
