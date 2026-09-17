import React, { useState } from 'react';

const FAQS = [
  {
    q: 'What file types does FolderMate support?',
    a: 'FolderMate natively supports all major graphic and vector formats including CorelDRAW (.cdr), Adobe Illustrator (.ai), Photoshop (.psd), PDF (.pdf), SVG, EPS, PNG, and JPG. Any file landing in your designated Inbox is automatically evaluated by the classification engine.',
  },
  {
    q: 'Is FolderMate really 100% free and open-source?',
    a: 'Yes! FolderMate is open-source under the MIT License. To unlock the desktop app, you generate a free Community License Key by completing any 3 quick community tasks (like starring the GitHub repo, reading our workflow guide, or following on social media).',
  },
  {
    q: 'Does FolderMate upload my private files to any cloud?',
    a: 'Never. FolderMate is strictly offline-first. All scanning, regex pattern matching, checksum validation, and file moving happen locally on your PC. No telemetry, no external server pings, and no cloud uploads.',
  },
  {
    q: 'What happens if a filename is ambiguous or unrecognized?',
    a: 'Files with a low confidence score are safely held in the Review Queue. FolderMate never guesses blindly. You can inspect the file, assign the client/project with a single click, or create an alias for future automatic matching.',
  },
  {
    q: 'Can FolderMate prevent accidental artwork overwrites?',
    a: 'Yes. FolderMate features smart version incrementing (e.g., v1 → v2 → v3). When a new revision arrives, FolderMate automatically detects existing versions in the target directory and assigns the next clean revision number in SQLite.',
  },
  {
    q: 'How does the atomic two-phase mover protect my data?',
    a: 'Before any source file is deleted from your Inbox, FolderMate stages a copy at the target path, verifies the byte length and integrity checksum, and confirms write success in SQLite. Your original artwork is 100% protected against corruption.',
  },
];

export default function FaqSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])); // First item open by default

  const toggle = (i: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const col1 = FAQS.map((item, idx) => ({ ...item, originalIndex: idx })).filter(
    (_, idx) => idx % 2 === 0
  );
  const col2 = FAQS.map((item, idx) => ({ ...item, originalIndex: idx })).filter(
    (_, idx) => idx % 2 === 1
  );

  const renderCard = (f: (typeof FAQS)[0] & { originalIndex: number }) => {
    const isOpen = openItems.has(f.originalIndex);
    return (
      <div
        key={f.originalIndex}
        className={`faq-card ${isOpen ? 'faq-card-open' : ''}`}
        onClick={() => toggle(f.originalIndex)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle(f.originalIndex);
          }
        }}
      >
        <div className="faq-question-row">
          <h3 className="faq-question-text">{f.q}</h3>
          <div className={`faq-toggle-icon ${isOpen ? 'open' : ''}`}>
            {isOpen ? '−' : '+'}
          </div>
        </div>
        {isOpen && (
          <div className="faq-answer animate-fade-up">
            <p>{f.a}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="star-badge" style={{ marginBottom: 12 }}>
            <span>❓</span> FREQUENTLY ASKED QUESTIONS
          </div>
          <h2>Got questions? We have answers.</h2>
          <p className="section-sub">
            Learn more about FolderMate’s offline architecture, supported formats, safety guarantees, and licensing.
          </p>
        </div>

        {/* FAQ Independent Columns Grid */}
        <div className="faq-grid">
          <div className="faq-column">{col1.map(renderCard)}</div>
          <div className="faq-column">{col2.map(renderCard)}</div>
        </div>

        {/* Rebuilt "Still Have Questions?" Neo-Brutalist Support Banner */}
        <div className="faq-still-card">
          <div className="faq-still-left">
            <div className="faq-still-icon">💬</div>
            <div className="faq-still-text">
              <h3>Still have questions or need custom rules?</h3>
              <p>
                Can’t find what you’re looking for? Our open-source maintainers and design community are active on GitHub Discussions.
              </p>
            </div>
          </div>
          <div className="faq-still-actions">
            <a
              href="https://github.com/logicbyroshan/foldermate/discussions"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              💬 ASK IN DISCUSSIONS
            </a>
            <a
              href="https://github.com/logicbyroshan/foldermate/issues"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              ⭐ OPEN AN ISSUE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
