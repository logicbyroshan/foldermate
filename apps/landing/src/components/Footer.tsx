interface FooterProps {
  onOpenPrivacy?: () => void;
}

export default function Footer({ onOpenPrivacy }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        {/* Top Callout Banner inside Footer */}
        <div className="footer-top-banner">
          <div className="footer-top-left">
            <div className="star-badge" style={{ marginBottom: 10 }}>
              <span>⭐</span> OPEN SOURCE &amp; OFFLINE FIRST
            </div>
            <h3>Ready to end manual file clutter?</h3>
            <p>Download the free Windows desktop app and start organizing design files in under 2 minutes.</p>
          </div>
          <div className="footer-top-actions">
            <a href="#download" className="btn btn-primary btn-lg">
              <span>📥</span> FREE DOWNLOAD (.EXE)
            </a>
            <a
              href="https://github.com/logicbyroshan/foldermate"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-lg"
            >
              <span>⭐</span> STAR ON GITHUB
            </a>
          </div>
        </div>

        {/* Main 4-Column Footer Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand & Mission */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-header">
              <div className="footer-logo-icon">
                <img src="/logo.png" alt="FolderMate" className="footer-logo-img" />
              </div>
              <span className="footer-brand-title">FolderMate</span>
            </div>
            <p className="footer-brand-desc">
              The offline-first desktop automation platform for graphic designers, print shops, and creative studios.
              Classifies, renames, and versions files with zero telemetry and zero cloud lock-in.
            </p>
            <div className="footer-badges-list">
              <span className="footer-badge">🟢 v1.0.0 Stable</span>
              <span className="footer-badge">🔒 100% Offline</span>
              <span className="footer-badge">⚡ MIT License</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="footer-col">
            <h4 className="footer-col-title">PRODUCT</h4>
            <ul className="footer-links">
              <li><a href="#features">⚡ Features &amp; Capabilities</a></li>
              <li><a href="#how-it-works">🔄 Two-Phase Safe Ingestion</a></li>
              <li><a href="#review-queue">🔍 Review Queue System</a></li>
              <li><a href="#download">🔑 Get Free Activation Key</a></li>
              <li><a href="#download">📥 Windows Installer (.exe)</a></li>
            </ul>
          </div>

          {/* Column 3: Resources & Guides */}
          <div className="footer-col">
            <h4 className="footer-col-title">RESOURCES</h4>
            <ul className="footer-links">
              <li><a href="#blog">🎨 CorelDRAW Workflow Tips</a></li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "inherit",
                    font: "inherit",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  🔒 DPDP Privacy Notice &amp; DSR Rights
                </button>
              </li>
              <li><a href="#blog">📊 Print Shop Case Study</a></li>
              <li><a href="#faq">❓ Frequently Asked Questions</a></li>
              <li>
                <a
                  href="https://github.com/logicbyroshan/foldermate#readme"
                  target="_blank"
                  rel="noreferrer"
                >
                  📖 GitHub Documentation ↗
                </a>
              </li>
            </ul>
          </div>


          {/* Column 4: Community & Connect */}
          <div className="footer-col">
            <h4 className="footer-col-title">COMMUNITY</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="https://github.com/logicbyroshan/foldermate"
                  target="_blank"
                  rel="noreferrer"
                >
                  ⭐ Star on GitHub ↗
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/logicbyroshan/foldermate/discussions"
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 Community Discussions ↗
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/logicbyroshan/foldermate/issues"
                  target="_blank"
                  rel="noreferrer"
                >
                  🐛 Report an Issue ↗
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  💼 LinkedIn Community ↗
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  🐦 X (Twitter) Updates ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} FolderMate. Free &amp; Open-Source under the MIT License.</span>
          </div>
          <div className="footer-bottom-center">
            <span>Crafted with ❤️ for graphic designers &amp; print studios</span>
          </div>
          <div className="footer-bottom-right">
            <span className="system-pill">Windows 10/11 x64</span>
            <span className="system-pill">SQLite WAL Mode</span>
            <span className="system-pill">Zero Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
