import React, { useState } from 'react';

const FAQS = [
  {
    q: 'What file types does FolderMate support?',
    a: 'FolderMate supports all common design file types including CDR (CorelDRAW), AI (Illustrator), PSD (Photoshop), PDF, SVG, PNG, JPG, EPS, and more. Any file in your Inbox will be processed by the classification engine.',
  },
  {
    q: 'Is FolderMate completely free?',
    a: 'Yes! FolderMate is open-source and free to use. To unlock the app you\'ll need a Community License Key, which you get by completing any 3 simple community tasks — like starring the GitHub repo, commenting on the blog, or following on social media.',
  },
  {
    q: 'Does FolderMate upload my files anywhere?',
    a: 'Absolutely not. FolderMate is 100% offline-first. It runs entirely on your local machine with no cloud connectivity, no telemetry, and no external API calls. Your files never leave your computer.',
  },
  {
    q: 'What happens to files FolderMate can\'t classify?',
    a: 'Files that don\'t meet the minimum confidence threshold are automatically routed to the Review Queue. You can then review them, assign the correct client and project, and approve the move — nothing is ever lost or incorrectly moved.',
  },
  {
    q: 'What benefits can I expect from using FolderMate?',
    a: 'FolderMate saves you hours of manual file renaming and folder organization. You get a perfectly consistent naming convention, automatic versioning, full audit history, and a clean folder structure — all with zero manual effort.',
  },
  {
    q: 'How do I get started with FolderMate?',
    a: 'Download the installer from our GitHub Releases page, run it, and follow the setup wizard. Configure your Inbox path and folder template, then just drop files into the Inbox — FolderMate does the rest automatically.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <h2>Frequently Asked<br />Questions</h2>
        <div className="faq-grid" style={{ marginTop: 40 }}>
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="faq-card"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                {f.q}
                <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 2 }}>
                  {open === i ? '−' : '+'}
                </span>
              </h3>
              {open === i && <p style={{ marginTop: 12 }}>{f.a}</p>}
            </div>
          ))}
        </div>

        <div className="faq-still">
          <h3>Still have questions?</h3>
          <a
            href="https://github.com/logicbyroshan/foldermate/discussions"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            CONTACT US
          </a>
        </div>
      </div>
    </section>
  );
}
