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
          <span className="split-mock-title">📂 C:\Studio\Clients\2026\</span>
          <span className="split-mock-pill">5 Files Organized</span>
        </div>

        <div className="split-mock-body">
          {[
            { ext: 'CDR', name: 'ABC_School_Annual_Sports_ID_2026.cdr', color: '#d97706', size: '24.2 MB', dest: 'Clients / ABC School / ID Cards /', ver: 'v8' },
            { ext: 'PDF', name: 'Apex_Healthcare_TriFold_Brochure_Draft.pdf', color: '#dc2626', size: '8.4 MB', dest: 'Clients / Apex / Brochures /', ver: 'v3' },
            { ext: 'AI',  name: 'Zenith_Corp_Staff_Lanyard_Artwork.ai', color: '#ea580c', size: '14.1 MB', dest: 'Clients / Zenith / Branding /', ver: 'v1' },
            { ext: 'PSD', name: 'City_Gala_Charity_Billboard_6x3m.psd', color: '#2563eb', size: '62.8 MB', dest: 'Clients / City Gala / Events /', ver: 'v2' },
            { ext: 'CDR', name: 'Nexus_Print_Packaging_Box_Dieline.cdr', color: '#d97706', size: '18.7 MB', dest: 'Clients / Nexus / Packaging /', ver: 'v4' },
          ].map((r, i) => (
            <div key={i} className="split-file-item">
              <span className="ext-badge" style={{ background: r.color }}>{r.ext}</span>
              <div className="split-file-details">
                <div className="split-file-title-row">
                  <span className="split-file-name">{r.name}</span>
                  <span className="split-file-ver-pill">{r.ver}</span>
                </div>
                <div className="split-file-meta-row">
                  <span className="split-file-dest">📁 {r.dest}</span>
                  <span className="split-file-size">{r.size}</span>
                </div>
              </div>
              <span className="split-file-status">✓ Moved</span>
            </div>
          ))}
        </div>

        <div className="split-mock-footer">
          <span>✓ Two-phase verification complete · SHA-256 matched · SQLite WAL committed</span>
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
          <span className="split-mock-title">🔍 Review Queue (Requires Confirmation)</span>
          <span className="split-mock-pill amber">3 Pending</span>
        </div>

        <div className="split-mock-body">
          {[
            {
              ext: 'PDF',
              color: '#dc2626',
              name: 'unknown_studio_brochure_draft_final.pdf',
              conf: '38% Confidence',
              reason: 'Unrecognized client name',
              suggestion: 'Suggestion: Assign to "Studio Velo"',
            },
            {
              ext: 'AI',
              color: '#ea580c',
              name: 'new_project_image_raw_export_master.ai',
              conf: '52% Confidence',
              reason: 'Category folder ambiguous',
              suggestion: 'Suggestion: Move to "Branding/2026"',
            },
            {
              ext: 'CDR',
              color: '#d97706',
              name: 'event_stage_backdrop_vector_final.cdr',
              conf: '64% Confidence',
              reason: 'Multiple client matches',
              suggestion: 'Suggestion: Match "City Gala"',
            },
          ].map((r, i) => (
            <div key={i} className="split-review-item">
              <span className="ext-badge" style={{ background: r.color }}>{r.ext}</span>
              <div className="split-review-left">
                <span className="split-review-name">{r.name}</span>
                <div className="split-review-details">
                  <span className="split-review-reason">⚠️ {r.reason}</span>
                  <span className="split-review-suggest">{r.suggestion}</span>
                </div>
              </div>
              <div className="split-review-right">
                <span className="conf-pill">{r.conf}</span>
                <button type="button" className="assign-btn">Assign &amp; Move →</button>
              </div>
            </div>
          ))}
        </div>

        <div className="split-mock-footer">
          <span>🔒 Safe Isolation: Ambiguous files stay in Inbox until your 1-click confirmation</span>
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
