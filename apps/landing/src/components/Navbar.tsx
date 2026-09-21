import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo with Brand Status Badge */}
        <a href="#" className="navbar-logo" onClick={closeMenu}>
          <div className="navbar-logo-icon">
            <img src="/logo.png" alt="FolderMate" className="navbar-logo-img" />
          </div>
          <span className="navbar-brand-name">FolderMate</span>
          <span className="navbar-version-badge">v1.0 · Free</span>
        </a>

        {/* Desktop Nav links with hover pills */}
        <ul className="navbar-links">
          <li><a href="#features" className="nav-link-item">Features</a></li>
          <li><a href="#how-it-works" className="nav-link-item">How It Works</a></li>
          <li><a href="#reviews" className="nav-link-item">Reviews</a></li>
          <li><a href="#blog" className="nav-link-item">Guides</a></li>
          <li><a href="#faq" className="nav-link-item">FAQ</a></li>
          <li>
            <a
              href="https://github.com/logicbyroshan/foldermate"
              target="_blank"
              rel="noreferrer"
              className="nav-link-item navbar-ext-link"
            >
              GitHub ↗
            </a>
          </li>
        </ul>

        {/* Desktop Action Buttons */}
        <div className="navbar-actions">
          <a
            href="https://github.com/logicbyroshan/foldermate"
            target="_blank"
            rel="noreferrer"
            className="navbar-github-btn desktop-only"
            title="Star FolderMate on GitHub"
          >
            <span className="github-star-icon">⭐</span>
            <span className="github-btn-label">Star</span>
            <span className="github-star-count">1.4k</span>
          </a>

          <a
            href="#download"
            className="btn btn-primary navbar-download-btn"
          >
            <span>📥</span> FREE DOWNLOAD
          </a>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-down">
          <ul className="mobile-drawer-links">
            <li><a href="#features" onClick={closeMenu}>⚡ Features & Capabilities</a></li>
            <li><a href="#how-it-works" onClick={closeMenu}>🔄 Two-Phase Safe Ingestion</a></li>
            <li><a href="#reviews" onClick={closeMenu}>⭐ Reviews & Ratings</a></li>
            <li><a href="#blog" onClick={closeMenu}>📚 Guides & Workflows</a></li>
            <li><a href="#faq" onClick={closeMenu}>❓ Frequently Asked Questions</a></li>
            <li>
              <a
                href="https://github.com/logicbyroshan/foldermate"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                ⭐ GitHub Repository ↗
              </a>
            </li>
          </ul>
          <div className="mobile-drawer-actions">
            <a
              href="#download"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={closeMenu}
            >
              📥 FREE DOWNLOAD (WINDOWS)
            </a>
            <a
              href="https://github.com/logicbyroshan/foldermate"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={closeMenu}
            >
              ⭐ Star on GitHub (1.4k)
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
