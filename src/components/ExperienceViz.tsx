// Vertical workflow rail: clear data inputs (top) → a free-floating cloud of
// glossy glass "data-science" bubbles (no box — internals stay vague) → a
// decision gate that branches downward into the kinds of predictions the work
// powers. Runs alongside the experience cards and spans their full height.

import { useState, useEffect } from 'react';

const PAL: Record<string, [string, string]> = {
  mint: ['#34d399', '#10b981'],
  sky: ['#38bdf8', '#0284c7'],
  violet: ['#a78bfa', '#7c3aed'],
  rose: ['#fb7185', '#e11d48'],
  amber: ['#fbbf24', '#d97706'],
};

const INPUTS = [
  { icon: '🗄️', label: 'Transactions', x: 8, y: 36 },
  { icon: '📡', label: 'Market signals', x: 122, y: 36 },
  { icon: '👥', label: 'Customer base', x: 8, y: 82 },
  { icon: '⚙️', label: 'Operations', x: 122, y: 82 },
];

const BUBBLES = [
  { t: 'Ensemble', x: 72, y: 262, r: 28, g: 'mint' },
  { t: 'Embeddings', x: 160, y: 258, r: 24, g: 'sky' },
  { t: 'Features', x: 44, y: 322, r: 26, g: 'violet' },
  { t: 'XGBoost', x: 116, y: 325, r: 23, g: 'sky' },
  { t: 'Bayesian', x: 188, y: 318, r: 22, g: 'rose' },
  { t: 'Time-Series', x: 78, y: 384, r: 27, g: 'violet' },
  { t: 'Tuning', x: 158, y: 380, r: 23, g: 'amber' },
  { t: 'Backtest', x: 48, y: 444, r: 25, g: 'mint' },
  { t: 'Drift', x: 116, y: 440, r: 20, g: 'rose' },
  { t: 'Calibrate', x: 184, y: 438, r: 24, g: 'amber' },
  { t: 'MLOps', x: 74, y: 502, r: 24, g: 'amber' },
  { t: 'CI/CD', x: 150, y: 500, r: 23, g: 'sky' },
  { t: 'Docker', x: 58, y: 556, r: 22, g: 'sky' },
  { t: 'Airflow', x: 128, y: 556, r: 24, g: 'violet' },
  { t: 'K8s', x: 196, y: 550, r: 19, g: 'rose' },
];

const OUTPUTS = [
  { icon: '📉', label: 'Late-payment', y: 772 },
  { icon: '📈', label: 'Forecasting', y: 812 },
  { icon: '🚨', label: 'Anomaly detection', y: 852 },
  { icon: '⚠️', label: 'Risk scoring', y: 892 },
];

const CX = 120;
const GY = 672;

const DESKTOP_INPUT_PATHS = [
  "M63 72 C63 130 120 120 120 170",
  "M177 72 C177 130 120 120 120 170",
  "M63 118 C63 135 120 130 120 170",
  "M177 118 C177 135 120 130 120 170",
  "M120 170 L120 196",
];

const DESKTOP_CLOUD_GATE = `M58 578 C58 606 ${CX} 606 ${CX} ${GY - 42}`;
const DESKTOP_CLOUD_GATE2 = `M196 569 C196 606 ${CX} 606 ${CX} ${GY - 42}`;
const DESKTOP_CLOUD_GATE3 = `M128 580 L${CX} ${GY - 42}`;

const DESKTOP_GATE_OUTPUT = `M${CX} ${GY + 42} C${CX} 745 10 740 10 772`;

const MOBILE_INPUTS = [
  { icon: '🗄️', label: 'Transactions', x: 24, y: 60 },
  { icon: '📡', label: 'Market signals', x: 24, y: 110 },
  { icon: '👥', label: 'Customer base', x: 24, y: 160 },
  { icon: '⚙️', label: 'Operations', x: 24, y: 210 },
];

const MOBILE_BUBBLES = BUBBLES.map((b, i) => ({
  ...b,
  x: [350, 420, 500, 575, 372, 455, 540, 345, 430, 515, 590, 388, 468, 545, 620][i],
  y: [70, 58, 76, 62, 122, 118, 126, 178, 174, 186, 174, 226, 222, 230, 218][i],
  r: Math.min(b.r, 22),
}));

const MOBILE_OUTPUTS = [
  { icon: '📉', label: 'Late-payment', x: 790, y: 48 },
  { icon: '📈', label: 'Forecasting', x: 790, y: 92 },
  { icon: '🚨', label: 'Anomaly detection', x: 790, y: 136 },
  { icon: '⚠️', label: 'Risk scoring', x: 790, y: 180 },
];

const DesktopSvg = () => (
  <svg viewBox="0 0 240 945" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Data inputs feed a proprietary modelling and MLOps layer that branches into predictions such as late-payment, forecasting and anomaly detection">
    <defs>
      <marker id="efah" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#94a3b8" /></marker>
      <filter id="efShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1e293b" floodOpacity="0.18" /></filter>
      {Object.entries(PAL).map(([k, [c1, c2]]) => (
        <radialGradient key={k} id={`gl-${k}`} cx="34%" cy="26%" r="82%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.82" />
          <stop offset="48%" stopColor={c1} stopOpacity="0.42" />
          <stop offset="100%" stopColor={c2} stopOpacity="0.55" />
        </radialGradient>
      ))}
    </defs>

    <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="800" letterSpacing="1.5" fill="#647488" fontSize="12" textAnchor="middle">
      <text x={CX} y="20">DATA IN</text>
      <text x={CX} y="210">DATA SCIENCE</text>
      <text x={CX} y="748">PREDICTIONS</text>
    </g>

    <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700">
      {INPUTS.map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={n.y} width="110" height="36" rx="9" fill="#fff" stroke="#cbd5e1" />
          <text x={n.x + 9} y={n.y + 24} fontSize="14">{n.icon}</text>
          <text x={n.x + 30} y={n.y + 22} fontSize="10.5" fill="#0f172a">{n.label}</text>
        </g>
      ))}
    </g>

    <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line">
      {DESKTOP_INPUT_PATHS.slice(0, 4).map((d, i) => <path key={i} d={d} />)}
    </g>
    <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line" markerEnd="url(#efah)">
      <path d={DESKTOP_INPUT_PATHS[4]} />
    </g>

    <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line" markerEnd="url(#efah)">
      <path d={DESKTOP_CLOUD_GATE} />
      <path d={DESKTOP_CLOUD_GATE2} />
      <path d={DESKTOP_CLOUD_GATE3} />
    </g>

    <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700" textAnchor="middle">
      {BUBBLES.map((b, i) => (
        <g key={b.t} className="eflow-bub" style={{ animationDelay: `${-i * 0.6}s`, animationDuration: `${5 + (i % 4)}s` }}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#gl-${b.g})`} stroke="rgba(255,255,255,.65)" strokeWidth="1.2" filter="url(#efShadow)" />
          <ellipse cx={b.x - b.r * 0.3} cy={b.y - b.r * 0.42} rx={b.r * 0.42} ry={b.r * 0.24} fill="rgba(255,255,255,.55)" />
          <text x={b.x} y={b.y + 3.5} fontSize={b.t.length > 8 ? 8.5 : 9.8} fill="#0f172a">{b.t}</text>
        </g>
      ))}
    </g>

    <g filter="url(#efShadow)">
      <polygon points={`${CX},${GY - 42} ${CX + 42},${GY} ${CX},${GY + 42} ${CX - 42},${GY}`} fill="url(#gl-violet)" stroke="rgba(255,255,255,.7)" strokeWidth="1.4" />
    </g>
    <text x={CX} y={GY + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a" fontFamily="ui-sans-serif,system-ui,sans-serif">DECIDE</text>

    <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line">
      <path d={DESKTOP_GATE_OUTPUT} />
      <path d="M10 772 L10 909" />
    </g>
    <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line" markerEnd="url(#efah)">
      {OUTPUTS.map((o) => <path key={o.label} d={`M10 ${o.y + 17} L40 ${o.y + 17}`} />)}
    </g>

    <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700">
      {OUTPUTS.map((o) => (
        <g key={o.label}>
          <rect x="40" y={o.y} width="195" height="34" rx="8" fill="#fff" stroke="#86efac" strokeWidth="1.6" />
          <text x="52" y={o.y + 22} fontSize="13">{o.icon}</text>
          <text x="74" y={o.y + 21} fontSize="10.5" fill="#0f172a">{o.label}</text>
        </g>
      ))}
    </g>
  </svg>
);

const MobileSvg = () => (
    <svg viewBox="0 0 960 280" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Data inputs feed a proprietary modelling and MLOps layer that branches into predictions such as late-payment, forecasting and anomaly detection">
      <defs>
        <marker id="efah-m" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#94a3b8" /></marker>
        <filter id="efShadow-m" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1e293b" floodOpacity="0.18" /></filter>
        {Object.entries(PAL).map(([k, [c1, c2]]) => (
          <radialGradient key={k} id={`gl-m-${k}`} cx="34%" cy="26%" r="82%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.82" />
            <stop offset="48%" stopColor={c1} stopOpacity="0.42" />
            <stop offset="100%" stopColor={c2} stopOpacity="0.55" />
          </radialGradient>
        ))}
      </defs>

      <g fill="none" stroke="#94a3b8" strokeWidth="1.8" className="eflow-line" strokeLinecap="round" strokeLinejoin="round">
        {MOBILE_INPUTS.map((n) => <path key={n.label} d={`M${n.x + 124} ${n.y + 17} Q248 ${n.y + 17} 248 152`} />)}
        <path d="M248 152 H330" markerEnd="url(#efah-m)" />
        <path d="M620 140 H674" markerEnd="url(#efah-m)" />
        <path d="M758 65 V197" />
        {MOBILE_OUTPUTS.map((o) => <path key={o.label} d={`M758 ${o.y + 17} H790`} markerEnd="url(#efah-m)" />)}
      </g>

      <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="800" letterSpacing="1.5" fill="#647488" fontSize="12" textAnchor="middle">
        <text x="151" y="27">DATA IN</text>
        <text x="480" y="27">DATA SCIENCE</text>
        <text x="864" y="27">PREDICTIONS</text>
      </g>

      <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700">
        {MOBILE_INPUTS.map((n) => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width="120" height="34" rx="9" fill="#fff" stroke="#cbd5e1" />
            <text x={n.x + 10} y={n.y + 22} fontSize="14">{n.icon}</text>
            <text x={n.x + 32} y={n.y + 21} fontSize="10.5" fill="#0f172a">{n.label}</text>
          </g>
        ))}
      </g>

      <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700" textAnchor="middle">
        {MOBILE_BUBBLES.map((b, i) => (
          <g key={b.t} className="eflow-bub" style={{ animationDelay: `${-i * 0.6}s`, animationDuration: `${5 + (i % 4)}s` }}>
            <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#gl-m-${b.g})`} stroke="rgba(255,255,255,.65)" strokeWidth="1.2" filter="url(#efShadow-m)" />
            <ellipse cx={b.x - b.r * 0.3} cy={b.y - b.r * 0.42} rx={b.r * 0.42} ry={b.r * 0.24} fill="rgba(255,255,255,.55)" />
            <text x={b.x} y={b.y + 3.5} fontSize={b.t.length > 8 ? 8.2 : 9.3} fill="#0f172a">{b.t}</text>
          </g>
        ))}
      </g>

      <g filter="url(#efShadow-m)">
        <polygon points="716,98 758,140 716,182 674,140" fill="url(#gl-m-violet)" stroke="rgba(255,255,255,.7)" strokeWidth="1.4" />
      </g>
      <text x="716" y="144" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a" fontFamily="ui-sans-serif,system-ui,sans-serif">DECIDE</text>

      <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700">
        {MOBILE_OUTPUTS.map((o) => (
          <g key={o.label}>
            <rect x={o.x} y={o.y} width="148" height="34" rx="8" fill="#fff" stroke="#86efac" strokeWidth="1.6" />
            <text x={o.x + 10} y={o.y + 22} fontSize="13">{o.icon}</text>
            <text x={o.x + 33} y={o.y + 21} fontSize="10.5" fill="#0f172a">{o.label}</text>
          </g>
        ))}
      </g>
    </svg>
);

export const ExperienceViz = () => {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="experience-flow">
      {isMobile ? <MobileSvg /> : <DesktopSvg />}
    </div>
  );
};
