import React, { useEffect, useRef, useState } from 'react';

const TARGET = '04823';

function OdometerDigit({ digit }: { digit: string }) {
  return <div className="odometer-digit">{digit}</div>;
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
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="odometer-section">
      <div className="container">
        <div ref={ref} className="odometer-card">
          {/* Top Counter Row */}
          <div className="odometer-display">
            <div className="odometer-digits">
              {displayed.split('').map((d, i) => (
                <OdometerDigit key={i} digit={d} />
              ))}
            </div>
            <div className="odometer-label-group">
              <span className="odometer-label">Files Organized Automatically</span>
              <span className="odometer-sublabel">And counting across our community users</span>
            </div>
          </div>

          {/* Description Text */}
          <p className="odometer-tagline">
            <strong>Your files are our priority</strong> — open-source, community-built,
            and trusted by graphic designers, print shop operators, and creative agencies worldwide.
          </p>

          {/* Action Links */}
          <div className="odometer-actions">
            <a
              href="https://github.com/logicbyroshan/foldermate/discussions"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-outline-sm"
            >
              💬 Join Community Discussions
            </a>
            <a
              href="https://github.com/logicbyroshan/foldermate"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-outline-sm"
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
