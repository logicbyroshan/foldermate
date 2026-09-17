import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, background: '#E89B00',
              border: '2px solid #1a1a1a', borderRadius: 8,
              boxShadow: '2px 2px 0 #1a1a1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>📁</div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem' }}>FolderMate</span>
          </div>
          <p>Your design files, organized — automatically. Open-source, offline-first, Windows-native.</p>
        </div>

        {/* Product links */}
        <div className="footer-links-col">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#download">Download</a>
          <a href="#faq">FAQ</a>
        </div>

        {/* Community links */}
        <div className="footer-links-col">
          <h4>Community</h4>
          <a href="https://github.com/logicbyroshan/foldermate" target="_blank" rel="noreferrer">GitHub ⭐</a>
          <a href="https://github.com/logicbyroshan/foldermate/discussions" target="_blank" rel="noreferrer">Discussions</a>
          <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="#" target="_blank" rel="noreferrer">X / Twitter</a>
        </div>

        {/* Legal links */}
        <div className="footer-links-col">
          <h4>Legal</h4>
          <a href="https://github.com/logicbyroshan/foldermate/blob/main/LICENSE" target="_blank" rel="noreferrer">MIT License</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} FolderMate. Open-source under the MIT License.</span>
        <span>Made with ❤️ for designers & print studios</span>
      </div>
    </footer>
  );
}
