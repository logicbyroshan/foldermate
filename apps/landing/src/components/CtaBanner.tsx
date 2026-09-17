import React from 'react';

export default function CtaBanner() {
  return (
    <section className="cta-banner" id="download">
      <div className="cta-banner-inner">
        <div className="cta-banner-text">
          <h2>Organize your design<br />files automatically</h2>
          <p>Try FolderMate today and stop wasting time renaming files manually.</p>
        </div>
        <div className="cta-banner-action">
          <a
            href="https://github.com/logicbyroshan/foldermate/releases"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-lg"
          >
            FREE DOWNLOAD
          </a>
          <p className="cta-banner-sub">No credit card required · Windows 10/11</p>
        </div>
      </div>
    </section>
  );
}
