import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 2px 0 #1a1a1a' : undefined }}>
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#" className="navbar-logo">
          <div className="navbar-logo-icon">📁</div>
          FolderMate
        </a>

        {/* Nav links */}
        <ul className="navbar-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li>
            <a href="https://github.com/logicbyroshan/foldermate" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <a
            href="https://github.com/logicbyroshan/foldermate"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-outline-sm"
          >
            ⭐ Star on GitHub
          </a>
          <a href="#download" className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '0.78rem' }}>
            FREE DOWNLOAD
          </a>
        </div>
      </div>
    </nav>
  );
}
