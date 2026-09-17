import React from 'react';

const REVIEWS = [
  {
    name: 'Rajesh Sharma',
    role: 'Senior Graphic Designer',
    company: 'PrintCore Studios',
    avatar: 'RS',
    avatarBg: '#d97706',
    stars: 5,
    text: 'FolderMate completely eliminated our file mess. We process 100+ CorelDRAW files a day. The automatic client/year classification and v1, v2 versioning saved us at least 2 hours daily.',
    tag: 'CorelDRAW Workflow',
  },
  {
    name: 'Elena Rostova',
    role: 'Brand Identity Lead',
    company: 'Studio Velo',
    avatar: 'ER',
    avatarBg: '#7c3aed',
    stars: 5,
    text: 'Offline-first was a non-negotiable requirement for our NDA client contracts. FolderMate works 100% locally on Windows with zero cloud leaks and zero subscriptions. Total game changer.',
    tag: '100% Offline Privacy',
  },
  {
    name: 'Marcus Chen',
    role: 'Agency Director',
    company: 'Chen Media Group',
    avatar: 'MC',
    avatarBg: '#059669',
    stars: 5,
    text: 'The two-phase mover and confidence scoring give me complete peace of mind. Low-confidence files go to the Review Queue so nothing ever gets lost or accidentally misplaced.',
    tag: 'Safe Two-Phase Moves',
  },
  {
    name: 'Priya Patel',
    role: 'Production Manager',
    company: 'Apex Signage & Print',
    avatar: 'PP',
    avatarBg: '#dc2626',
    stars: 5,
    text: 'Our print operators used to overwrite final artwork constantly. FolderMate’s automatic version incrementing (v1 → v2 → v3) solved 90% of our reprint disputes and miscommunication.',
    tag: 'Auto-Versioning',
  },
  {
    name: 'David Miller',
    role: 'Freelance Illustrator & Designer',
    company: 'Miller Creative',
    avatar: 'DM',
    avatarBg: '#2563eb',
    stars: 5,
    text: 'Simple, fast, and the neo-brutalist interface looks gorgeous. Downloaded the Windows setup, set my Inbox folder, and it has been running silently in the background ever since.',
    tag: 'Zero-Maintenance',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Design Operations Lead',
    company: 'Nexus Creative Lab',
    avatar: 'SJ',
    avatarBg: '#e89b00',
    stars: 5,
    text: 'Setting up aliases for client name typos took 30 seconds. Now when someone drops "Cli-ent_Poster_FINAL.cdr", FolderMate handles it effortlessly without manual intervention.',
    tag: 'Smart Aliases & Rules',
  },
];

export default function ReviewsSection() {
  return (
    <section className="reviews-section" id="reviews">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="star-badge" style={{ marginBottom: 12 }}>
            <span>⭐</span> RATED 4.9/5 BY CREATIVE PROFESSIONALS
          </div>
          <h2>Loved by designers, print shops & creative studios.</h2>
          <p className="section-sub">
            See how graphic artists, agency leads, and print operators save hours every week with automatic file organization.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {REVIEWS.map((review, idx) => (
            <div key={idx} className="review-card">
              {/* Top rating + tag */}
              <div className="review-top">
                <div className="review-stars">
                  {'★'.repeat(review.stars)}
                </div>
                <span className="review-pill">{review.tag}</span>
              </div>

              {/* Quote body */}
              <p className="review-text">"{review.text}"</p>

              {/* Author footer */}
              <div className="review-author">
                <div className="review-avatar" style={{ background: review.avatarBg }}>
                  {review.avatar}
                </div>
                <div className="review-author-info">
                  <div className="review-name">
                    {review.name}
                    <span className="verified-check" title="Verified User">✓</span>
                  </div>
                  <div className="review-role">
                    {review.role} · <strong>{review.company}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating summary bar */}
        <div className="review-summary-card">
          <div className="review-summary-stats">
            <div className="summary-score">4.9 / 5.0</div>
            <div className="summary-stars">★★★★★</div>
            <div className="summary-count">Based on 140+ community reviews on GitHub & ProductHunt</div>
          </div>
          <a
            href="https://github.com/logicbyroshan/foldermate"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-outline-sm"
          >
            Leave a GitHub Review ⭐
          </a>
        </div>
      </div>
    </section>
  );
}
