import React from 'react';

function OrganizeMock() {
  return (
    <div className="split-mock-container">
      <div className="split-mock-window">
        <div className="split-mock-header">
          <div className="window-dots">
            <div className="dot dot-red" />
            <div className="dot dot-yellow" />
            <div className="dot dot-green" />
          </div>
          <span className="split-mock-title">📁 Organized / Clients / 2026 /</span>
          <span className="split-mock-pill">5 files organized</span>
        </div>
        <div className="split-mock-body">
          {[
            { ext: 'CDR', name: 'ABC School Annual ID 2026 v8.cdr', color: '#d97706', size: '24.2 MB' },
            { ext: 'PDF', name: 'Apex Healthcare Brochure v3.pdf', color: '#dc2626', size: '8.4 MB' },
            { ext: 'AI',  name: 'Zenith Corp Lanyard Design v1.ai', color: '#ea580c', size: '14.1 MB' },
            { ext: 'PSD', name: 'City Gala Poster Final v2.psd', color: '#2563eb', size: '62.8 MB' },
          ].map((r, i) => (
            <div key={i} className="split-file-item">
              <span className="ext-badge" style={{ background: r.color }}>{r.ext}</span>
              <div className="split-file-details">
                <span className="split-file-name">{r.name}</span>
                <span className="split-file-size">{r.size}</span>
              </div>
              <span className="split-file-status">✓ Moved</span>
            </div>
          ))}
        </div>
        <div className="split-mock-footer">
          <span>✓ Two-phase verification complete · Zero data loss</span>
        </div>
      </div>
    </div>
  );
}

function ReviewQueueMock() {
  return (
    <div className="split-mock-container">
      <div className="split-mock-window review-window">
        <div className="split-mock-header">
          <div className="window-dots">
            <div className="dot dot-red" />
            <div className="dot dot-yellow" />
            <div className="dot dot-green" />
          </div>
          <span className="split-mock-title">🔍 Review Queue (Needs Approval)</span>
          <span className="split-mock-pill amber">2 pending</span>
        </div>
        <div className="split-mock-body">
          {[
            {
              name: 'unknown_studio_brochure_draft_final.pdf',
              conf: '38% Match',
              reason: 'Unclear client name',
            },
            {
              name: 'new_project_image_raw_export.ai',
              conf: '52% Match',
              reason: 'Category ambiguous',
            },
          ].map((r, i) => (
            <div key={i} className="split-review-item">
              <div className="split-review-left">
                <span className="split-review-name">{r.name}</span>
                <span className="split-review-reason">⚠️ {r.reason}</span>
              </div>
              <div className="split-review-right">
                <span className="conf-pill">{r.conf}</span>
                <button type="button" className="assign-btn">Assign →</button>
              </div>
            </div>
          ))}
        </div>
        <div className="split-mock-footer">
          <span>🔒 Low-confidence files held securely until your 1-click confirmation</span>
        </div>
      </div>
    </div>
  );
}

const SECTIONS = [
  {
    id: 'how-it-works',
    label: 'TWO-PHASE SAFETY',
    headline: 'Boost your studio’s productivity with zero risk.',
    body: 'FolderMate watches your Inbox directory and moves completed design files automatically using atomic two-phase copies, checksum verification, and SQLite transaction logging.',
    cards: [
      {
        icon: '🔒',
        title: 'Zero file loss guarantee',
        body: 'Source files are never removed until the destination copy passes strict byte-length and checksum integrity checks.',
      },
      {
        icon: '🗄️',
        title: 'Full audit history & SQLite WAL',
        body: 'Every operation is logged with timestamps, confidence scores, and version lineages for complete traceability.',
      },
    ],
    visual: <OrganizeMock />,
    reverse: false,
  },
  {
    id: 'review-queue',
    label: 'ACCURACY & CONTROL',
    headline: 'Route ambiguous files to the smart Review Queue.',
    body: 'Not every incoming file has a perfect name. FolderMate’s confidence scoring engine catches low-confidence files and routes them to a dedicated queue so you stay in total control.',
    cards: [
      {
        icon: '⚡',
        title: 'Smart confidence scoring',
        body: 'Filenames are evaluated against regex patterns, client aliases, and rules. High confidence files organize immediately.',
      },
      {
        icon: '🎯',
        title: 'One-click manual classification',
        body: 'Assign client, category, and year with a single click in the Review Queue — FolderMate moves the file instantly.',
      },
    ],
    visual: <ReviewQueueMock />,
    reverse: true,
  },
];

export default function SplitFeatures() {
  return (
    <>
      {SECTIONS.map((s) => (
        <section key={s.id} className="split-section" id={s.id}>
          <div className="container">
            <div className={`split-inner${s.reverse ? ' reverse' : ''}`}>
              {/* Visual Mock Column */}
              <div className="split-visual-col">
                {s.visual}
              </div>

              {/* Text Description Column */}
              <div className="split-text-col">
                <div className="split-label">{s.label}</div>
                <h2>{s.headline}</h2>
                <p className="split-subtext">{s.body}</p>
                <div className="split-cards-list">
                  {s.cards.map((c) => (
                    <div key={c.title} className="split-card">
                      <span className="split-card-icon">{c.icon}</span>
                      <div className="split-card-content">
                        <h3>{c.title}</h3>
                        <p>{c.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
