import type { CSSProperties } from 'react';

const ORBIT_ICONS = ['🎓', '📚', '📐', '📊', '🧮', '📜'];

export const EducationCape = () => (
  <div className="education-cape scene-3d" aria-hidden="true">
    <div className="cape-hat">
      <svg viewBox="0 0 180 130" className="cape-hat-svg">
        <defs>
          <linearGradient id="capeHatGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="55%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <path className="cape-board cape-board--shadow" d="M90 16 14 54l76 38 76-38Z" />
        <path className="cape-board" d="M90 10 18 47l72 37 72-37Z" fill="url(#capeHatGrad)" />
        <path className="cape-cap" d="M55 72c17 16 52 16 70 0v30c-20 13-50 13-70 0Z" />
        <path className="cape-tassel" d="M126 48c18 20 20 42 4 63" />
        <circle className="cape-tassel-bead" cx="130" cy="112" r="6" />
      </svg>
    </div>
    <div className="cape-orbit">
      {ORBIT_ICONS.map((icon, index) => (
        <span key={icon} style={{ '--i': index } as CSSProperties}>{icon}</span>
      ))}
    </div>
  </div>
);
