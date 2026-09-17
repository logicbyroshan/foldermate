import React from 'react';

function MockIso() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 460, height: 320 }}>
      {/* Back card */}
      <div style={{
        position: 'absolute', top: 0, left: 80, width: 300, height: 190,
        background: 'rgba(232,155,0,0.12)', border: '2px solid #1a1a1a',
        borderRadius: 14, boxShadow: '4px 4px 0 #1a1a1a', padding: 16,
      }}>
        <div style={{ height: 10, borderRadius: 4, background: 'rgba(0,0,0,0.1)', marginBottom: 8 }} />
        <div style={{ height: 10, borderRadius: 4, background: 'rgba(0,0,0,0.07)', marginBottom: 8, width: '70%' }} />
      </div>
      {/* Middle card */}
      <div style={{
        position: 'absolute', top: 35, left: 50, width: 330, height: 210,
        background: 'rgba(255,255,255,0.7)', border: '2px solid #1a1a1a',
        borderRadius: 14, boxShadow: '4px 4px 0 #1a1a1a', padding: 18,
      }}>
        <div style={{ height: 12, borderRadius: 4, background: 'rgba(0,0,0,0.1)', marginBottom: 10 }} />
        <div style={{ height: 12, borderRadius: 4, background: 'rgba(232,155,0,0.3)', marginBottom: 10 }} />
        <div style={{ height: 12, borderRadius: 4, background: 'rgba(0,0,0,0.07)', width: '60%' }} />
      </div>
      {/* Front card */}
      <div style={{
        position: 'absolute', top: 70, left: 20, width: 360, height: 230,
        background: '#EDE7D1', border: '2px solid #1a1a1a',
        borderRadius: 14, boxShadow: '6px 6px 0 #1a1a1a', padding: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.12)', paddingBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>📁</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#555' }}>Organized Files</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, background: '#E89B00', color: '#000', padding: '2px 8px', borderRadius: 4 }}>5 files</span>
        </div>
        {[
          { ext: 'CDR', name: 'ABC School ID Card 2026 v8.cdr', color: '#d97706' },
          { ext: 'PDF', name: 'Apex Healthcare Brochure v3.pdf', color: '#dc2626' },
          { ext: 'AI',  name: 'Zenith Corp Lanyard 2025 v1.ai',  color: '#ea580c' },
        ].map((r) => (
          <div key={r.name} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
            borderRadius: 6, background: 'rgba(0,0,0,0.04)', marginBottom: 6,
          }}>
            <span style={{ fontSize: 9, fontWeight: 800, background: r.color, color: '#fff', padding: '2px 4px', borderRadius: 3 }}>{r.ext}</span>
            <span style={{ fontSize: 11, fontWeight: 600, flex: 1 }}>{r.name}</span>
            <span style={{ fontSize: 9, fontWeight: 800, background: '#10b981', color: '#fff', padding: '2px 5px', borderRadius: 3 }}>✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewQueueMock() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 460, height: 320 }}>
      {/* Back */}
      <div style={{
        position: 'absolute', top: 10, right: 0, width: 300, height: 190,
        background: 'rgba(0,0,0,0.04)', border: '2px solid #1a1a1a',
        borderRadius: 14, boxShadow: '4px 4px 0 #1a1a1a', padding: 16,
      }}>
        <div style={{ height: 10, borderRadius: 4, background: 'rgba(0,0,0,0.08)', marginBottom: 8 }} />
        <div style={{ height: 10, borderRadius: 4, background: 'rgba(0,0,0,0.05)', width: '70%' }} />
      </div>
      {/* Front */}
      <div style={{
        position: 'absolute', top: 60, left: 0, width: 380, height: 240,
        background: '#EDE7D1', border: '2px solid #1a1a1a',
        borderRadius: 14, boxShadow: '6px 6px 0 #1a1a1a', padding: 22,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 10 }}>
          <span style={{ fontSize: 14 }}>🔍</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#555' }}>Review Queue</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, background: '#E89B00', color: '#000', padding: '2px 8px', borderRadius: 4 }}>2 items</span>
        </div>
        {[
          { name: 'unknown studio poster draft final.pdf', conf: '38%', status: 'Needs Review' },
          { name: 'new project image compressed.ai', conf: '52%', status: 'Needs Review' },
        ].map((r) => (
          <div key={r.name} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
            borderRadius: 7, border: '1px solid rgba(232,155,0,0.35)', background: 'rgba(232,155,0,0.08)', marginBottom: 8,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, flex: 1 }}>{r.name}</span>
            <span style={{ fontSize: 9, fontWeight: 800, background: '#f59e0b', color: '#000', padding: '2px 5px', borderRadius: 3 }}>{r.conf}</span>
          </div>
        ))}
        <p style={{ fontSize: 10, color: '#888', marginTop: 8 }}>Low-confidence files are held here for your review — nothing gets moved without your approval.</p>
      </div>
    </div>
  );
}

const SECTIONS = [
  {
    id: 'organize',
    label: 'Organize',
    headline: 'Boost Your Studio\'s\nProductivity with\nFolderMate',
    body: 'FolderMate is a powerful Windows desktop app that watches your Inbox and automatically classifies, renames, and versions your design files — resulting in a perfectly organized folder structure every time.',
    cards: [
      { icon: '✅', title: 'Organize without losing any files', body: 'Two-phase move with integrity checks means your files are always safe. Originals are never deleted until the copy is verified.' },
      { icon: '🗄️', title: 'Full audit history with SQLite metadata', body: 'Every file operation is logged. See version history, timestamps, client attribution, and classification confidence at a glance.' },
    ],
    visual: <MockIso />,
    reverse: false,
  },
  {
    id: 'review',
    label: 'Review',
    headline: 'Route low-confidence\nfiles to the\nReview Queue',
    body: 'Not every file has a clear name. FolderMate\'s confidence scoring catches ambiguous files and sends them to a Review Queue so you always stay in control — nothing gets moved without your sign-off.',
    cards: [
      { icon: '⚡', title: 'Automatic confidence scoring', body: 'Each file gets a score based on how well it matched your rules. High confidence = auto-organized. Low confidence = routed to review.' },
      { icon: '🎯', title: 'One-click manual organization', body: 'Review queue lets you assign client, project, and category with a single click — then FolderMate moves the file perfectly.' },
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
          <div className={`split-inner${s.reverse ? ' reverse' : ''}`} style={{ maxWidth: 1160, margin: '0 auto' }}>
            {/* Visual */}
            <div style={{ display: 'flex', justifyContent: s.reverse ? 'flex-end' : 'flex-start' }}>
              {s.visual}
            </div>

            {/* Text */}
            <div className="split-text">
              <div className="split-label">{s.label}</div>
              <h2 style={{ whiteSpace: 'pre-line', marginBottom: 18 }}>{s.headline}</h2>
              <p style={{ marginBottom: 28 }}>{s.body}</p>
              <div className="split-cards">
                {s.cards.map((c) => (
                  <div key={c.title} className="split-card">
                    <span className="split-card-icon">{c.icon}</span>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
