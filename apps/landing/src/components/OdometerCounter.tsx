import React, { useEffect, useRef, useState } from 'react';

const TARGET = '04823';

function OdometerDigit({ digit }: { digit: string }) {
  return (
    <div className="odometer-digit">{digit}</div>
  );
}

export default function OdometerCounter() {
  const [displayed, setDisplayed] = useState('00000');
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          let frame = 0;
          const total = 60;
          const tick = () => {
            frame++;
            const progress = frame / total;
            const eased = 1 - Math.pow(1 - progress, 3);
            const num = Math.floor(eased * parseInt(TARGET, 10));
            setDisplayed(String(num).padStart(5, '0'));
            if (frame < total) requestAnimationFrame(tick);
            else setDisplayed(TARGET);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{ padding: '0 24px 80px' }}>
      <div
        ref={ref}
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40,
        }}
      >
        {/* Left phone mock */}
        <div className="phone-mock phone-mock-purple">
          <div className="phone-camera" />
          <div className="phone-speaker" />
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px', width: '100%' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
        </div>

        {/* Main counter card */}
        <div className="odometer-card">
          <div className="odometer-display">
            <div className="odometer-digits">
              {displayed.split('').map((d, i) => (
                <OdometerDigit key={i} digit={d} />
              ))}
            </div>
            <span className="odometer-label">Files Organized</span>
          </div>
          <p className="odometer-tagline">
            <strong>Your files are our priority</strong> — open-source, community-built,
            trusted by designers &amp; print studios worldwide.{' '}
          </p>
          <a
            href="https://github.com/logicbyroshan/foldermate/discussions"
            target="_blank"
            rel="noreferrer"
            className="odometer-contact"
          >
            💬 Join the community discussion
          </a>
        </div>

        {/* Right phone mock */}
        <div className="phone-mock phone-mock-dark">
          <div className="phone-camera" />
          <div className="phone-speaker" />
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px', width: '100%' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
