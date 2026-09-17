import React from 'react';

const ARTICLES = [
  {
    category: 'CorelDRAW Workflow',
    categoryColor: '#d97706',
    title: 'How to Organize 10,000+ Vector & CDR Files Without Expensive Cloud Tools',
    excerpt:
      'Learn how automated client/project/year classification rules prevent accidental artwork overwrites and speed up print turnaround times.',
    readTime: '5 min read',
    date: 'Sep 2026',
    icon: '🎨',
  },
  {
    category: 'Privacy & Security',
    categoryColor: '#7c3aed',
    title: 'Why Local-First & Zero Telemetry Matter for Client NDAs & Print Shops',
    excerpt:
      'A technical look at why desktop-native automation with SQLite beats cloud storage sync conflicts, file locking issues, and compliance risks.',
    readTime: '4 min read',
    date: 'Sep 2026',
    icon: '🔒',
  },
  {
    category: 'Case Study',
    categoryColor: '#059669',
    title: 'From Inbox Chaos to Clean: How Auto-Versioning Saved a 12-Person Print Shop',
    excerpt:
      'How Apex Signage implemented FolderMate’s two-phase atomic mover and revision tagging to eliminate costly reprint disputes entirely.',
    readTime: '6 min read',
    date: 'Sep 2026',
    icon: '⚡',
  },
];

export default function BlogSection() {
  return (
    <section className="blog-section" id="blog">
      <div className="container">
        {/* Header */}
        <div className="section-header text-center">
          <div className="star-badge" style={{ marginBottom: 12 }}>
            <span>📚</span> WORKFLOW GUIDES & BEST PRACTICES
          </div>
          <h2>Master your design file organization.</h2>
          <p className="section-sub">
            In-depth guides, CorelDRAW productivity tricks, and desktop organization strategies from the FolderMate team.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="blog-grid">
          {ARTICLES.map((art, idx) => (
            <article key={idx} className="blog-card">
              {/* Card visual header */}
              <div className="blog-thumb">
                <div className="blog-thumb-icon">{art.icon}</div>
                <span
                  className="blog-category"
                  style={{ background: art.categoryColor }}
                >
                  {art.category}
                </span>
                <span className="blog-time">{art.readTime}</span>
              </div>

              {/* Card content */}
              <div className="blog-body">
                <div className="blog-meta">
                  <span>{art.date}</span> · <span>FolderMate Guides</span>
                </div>
                <h3 className="blog-title">{art.title}</h3>
                <p className="blog-excerpt">{art.excerpt}</p>

                <div className="blog-footer">
                  <a
                    href="https://github.com/logicbyroshan/foldermate"
                    target="_blank"
                    rel="noreferrer"
                    className="blog-link"
                  >
                    Read Guide <span>→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
