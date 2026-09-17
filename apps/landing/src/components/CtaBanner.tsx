import React, { useState } from 'react';

const COMMUNITY_TASKS = [
  {
    id: 'star',
    title: '⭐ Star FolderMate on GitHub',
    desc: 'Support open-source development with a GitHub star (Required)',
    url: 'https://github.com/logicbyroshan/foldermate',
    actionText: 'Star Repository ↗',
    required: true,
  },
  {
    id: 'guide',
    title: '📖 Read & Bookmark the Workflow Guide',
    desc: 'Check out the CorelDRAW & vector file organization manual',
    url: '#blog',
    actionText: 'Open Guide ↓',
  },
  {
    id: 'follow_github',
    title: '👤 Follow @logicbyroshan on GitHub',
    desc: 'Stay updated with upcoming FolderMate releases and plugins',
    url: 'https://github.com/logicbyroshan',
    actionText: 'Follow on GitHub ↗',
  },
  {
    id: 'linkedin',
    title: '💼 Share or Like on LinkedIn',
    desc: 'Share FolderMate with print shop and design colleagues',
    url: 'https://linkedin.com',
    actionText: 'Open LinkedIn ↗',
  },
  {
    id: 'x',
    title: '🐦 Repost / Follow on X (Twitter)',
    desc: 'Help spread the word to freelance designers',
    url: 'https://x.com',
    actionText: 'Open X ↗',
  },
];

export default function CtaBanner() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({ star: false });
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleTask = (id: string) => {
    setCompleted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const isEligible = completedCount >= 3;

  const handleGenerateKey = () => {
    if (!isEligible) return;
    const segments = Array.from({ length: 4 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase()
    );
    const key = `FM-${segments.join('-')}`;
    setGeneratedKey(key);
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="cta-banner" id="download">
      <div className="container">
        {/* Main CTA Hero Header */}
        <div className="cta-banner-header text-center">
          <div className="star-badge" style={{ marginBottom: 12 }}>
            <span>⚡</span> WINDOWS 10 / 11 NATIVE DESKTOP APP
          </div>
          <h2>Ready to organize your files automatically?</h2>
          <p className="section-sub">
            Download FolderMate for Windows. Run it offline with zero cloud lock-in and zero subscriptions.
          </p>
        </div>

        {/* Download & Key Generator Split Grid */}
        <div className="download-grid">
          {/* Box 1: Windows Installer Download */}
          <div className="download-card">
            <div className="download-card-badge">OFFICIAL RELEASE</div>
            <div className="download-card-icon">💻</div>
            <h3>FolderMate for Windows</h3>
            <p className="download-version-text">
              Version 1.0.0 · 64-bit Windows installer · Offline-first
            </p>

            <ul className="download-features-list">
              <li>✓ CorelDRAW (.cdr) + AI + PSD + PDF Ingestion</li>
              <li>✓ Two-phase atomic mover with zero data loss</li>
              <li>✓ SQLite WAL metadata + Review Queue</li>
              <li>✓ 100% Free & Open-Source</li>
            </ul>

            <div className="download-btn-wrap">
              <a
                href="https://github.com/logicbyroshan/foldermate/releases"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>📥</span> DOWNLOAD INSTALLER (.EXE)
              </a>
              <span className="download-meta-note">
                Requires Windows 10/11 · ~78 MB installer
              </span>
            </div>
          </div>

          {/* Box 2: Instant Activation Key Generator */}
          <div className="key-generator-card">
            <div className="key-gen-header">
              <span className="key-gen-pill">🔑 FREE ACTIVATION KEY</span>
              <h3>Get Your Free License Key</h3>
              <p>Complete any 3 quick community tasks to unlock your free activation key:</p>
            </div>

            {/* Task list */}
            <div className="tasks-list">
              {COMMUNITY_TASKS.map((task) => {
                const isChecked = !!completed[task.id];
                return (
                  <div
                    key={task.id}
                    className={`task-row ${isChecked ? 'task-row-done' : ''}`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="task-checkbox"
                    />
                    <div className="task-content">
                      <div className="task-title-row">
                        <span className="task-title">{task.title}</span>
                      </div>
                      <span className="task-desc">{task.desc}</span>
                    </div>
                    <a
                      href={task.url}
                      target={task.url.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="task-action-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {task.actionText}
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Progress & Key Claim */}
            <div className="key-gen-footer">
              <div className="task-progress-bar-wrap">
                <div className="task-progress-label">
                  <span>Tasks Completed: <strong>{completedCount} / 3 required</strong></span>
                  <span>{Math.min(100, Math.round((completedCount / 3) * 100))}%</span>
                </div>
                <div className="task-progress-track">
                  <div
                    className="task-progress-fill"
                    style={{ width: `${Math.min(100, (completedCount / 3) * 100)}%` }}
                  />
                </div>
              </div>

              {!generatedKey ? (
                <button
                  type="button"
                  className={`btn ${isEligible ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', justifyContent: 'center', opacity: isEligible ? 1 : 0.6 }}
                  disabled={!isEligible}
                  onClick={handleGenerateKey}
                >
                  {isEligible ? '✨ UNLOCK MY ACTIVATION KEY' : 'Complete 3 Tasks To Unlock Key'}
                </button>
              ) : (
                <div className="generated-key-box animate-fade-up">
                  <span className="key-label">Your Unique Activation Key:</span>
                  <div className="key-display-row">
                    <code className="key-code">{generatedKey}</code>
                    <button
                      type="button"
                      className="btn btn-outline btn-outline-sm"
                      onClick={handleCopyKey}
                    >
                      {copied ? '✓ COPIED!' : '📋 COPY KEY'}
                    </button>
                  </div>
                  <span className="key-note">
                    Paste this key in the FolderMate desktop app activation screen to activate!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
