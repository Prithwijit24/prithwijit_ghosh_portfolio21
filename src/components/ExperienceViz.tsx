// Vertical workflow rail: clear data inputs (top) → a free-floating cloud of
// glossy glass "data-science" bubbles (no box — internals stay vague) → a
// decision gate that branches downward into the kinds of predictions the work
// powers. Runs alongside the experience cards and spans their full height.

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
  { t: 'Ensemble', x: 78, y: 265, r: 30, g: 'mint' },
  { t: 'Embeddings', x: 170, y: 265, r: 25, g: 'sky' },
  { t: 'Features', x: 48, y: 330, r: 29, g: 'violet' },
  { t: 'XGBoost', x: 128, y: 330, r: 24, g: 'sky' },
  { t: 'Bayesian', x: 200, y: 330, r: 22, g: 'rose' },
  { t: 'MLOps', x: 82, y: 400, r: 23, g: 'amber' },
  { t: 'Time-Series', x: 172, y: 400, r: 28, g: 'violet' },
  { t: 'Tuning', x: 52, y: 465, r: 24, g: 'amber' },
  { t: 'Backtest', x: 128, y: 465, r: 27, g: 'mint' },
  { t: 'Drift', x: 200, y: 465, r: 21, g: 'rose' },
  { t: 'Calibrate', x: 122, y: 530, r: 26, g: 'amber' },
];

const OUTPUTS = [
  { icon: '📉', label: 'Late-payment', y: 740 },
  { icon: '📈', label: 'Forecasting', y: 780 },
  { icon: '🚨', label: 'Anomaly detection', y: 820 },
  { icon: '⚠️', label: 'Risk scoring', y: 860 },
  { icon: '🔁', label: 'Churn prediction', y: 900 },
  { icon: '📦', label: 'Demand planning', y: 940 },
];

const CX = 120;
const GY = 640; // gate centre

export const ExperienceViz = () => (
  <div className="experience-flow">
    <svg viewBox="0 0 240 1010" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Data inputs feed a proprietary modelling layer that branches into predictions such as late-payment, forecasting and anomaly detection">
      <defs>
        <marker id="efah" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#94a3b8" /></marker>
        <filter id="efShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1e293b" floodOpacity="0.18" /></filter>
        {Object.entries(PAL).map(([k, [c1, c2]]) => (
          <radialGradient key={k} id={`gl-${k}`} cx="34%" cy="26%" r="82%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="46%" stopColor={c1} stopOpacity="0.4" />
            <stop offset="100%" stopColor={c2} stopOpacity="0.6" />
          </radialGradient>
        ))}
      </defs>

      {/* zone headers */}
      <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="800" letterSpacing="1.5" fill="#647488" fontSize="12" textAnchor="middle">
        <text x={CX} y="20">DATA IN</text>
        <text x={CX} y="210">DATA SCIENCE</text>
        <text x={CX} y="715">PREDICTIONS</text>
      </g>

      {/* inputs */}
      <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700">
        {INPUTS.map((n) => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width="110" height="36" rx="9" fill="#fff" stroke="#cbd5e1" />
            <text x={n.x + 9} y={n.y + 24} fontSize="14">{n.icon}</text>
            <text x={n.x + 30} y={n.y + 22} fontSize="10.5" fill="#0f172a">{n.label}</text>
          </g>
        ))}
      </g>

      {/* flows: inputs -> cloud */}
      <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line">
        <path d="M63 72 C63 130 120 120 120 170" />
        <path d="M177 72 C177 130 120 120 120 170" />
        <path d="M63 118 C63 135 120 130 120 170" />
        <path d="M177 118 C177 135 120 130 120 170" />
      </g>
      <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line" markerEnd="url(#efah)">
        <path d="M120 170 L120 196" />
      </g>

      {/* flows: cloud -> gate */}
      <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line" markerEnd="url(#efah)">
        <path d={`M82 488 C82 545 ${CX} 540 ${CX} ${GY - 42}`} />
        <path d={`M172 488 C172 545 ${CX} 540 ${CX} ${GY - 42}`} />
        <path d={`M${CX} 556 L${CX} ${GY - 42}`} />
      </g>

      {/* glossy bubbles */}
      <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700" textAnchor="middle">
        {BUBBLES.map((b, i) => (
          <g key={b.t} className="eflow-bub" style={{ animationDelay: `${-i * 0.6}s`, animationDuration: `${5 + (i % 4)}s` }}>
            <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#gl-${b.g})`} stroke="rgba(255,255,255,.65)" strokeWidth="1.2" filter="url(#efShadow)" />
            <ellipse cx={b.x - b.r * 0.3} cy={b.y - b.r * 0.42} rx={b.r * 0.42} ry={b.r * 0.24} fill="rgba(255,255,255,.55)" />
            <text x={b.x} y={b.y + 3.5} fontSize={b.t.length > 8 ? 8.5 : 9.8} fill="#0f172a">{b.t}</text>
          </g>
        ))}
      </g>

      {/* decision gate (diamond) */}
      <g filter="url(#efShadow)">
        <polygon points={`${CX},${GY - 42} ${CX + 42},${GY} ${CX},${GY + 42} ${CX - 42},${GY}`} fill="url(#gl-violet)" stroke="rgba(255,255,255,.7)" strokeWidth="1.4" />
      </g>
      <text x={CX} y={GY + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a" fontFamily="ui-sans-serif,system-ui,sans-serif">DECIDE</text>

      {/* flows: gate -> distribution bus -> outputs */}
      <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line">
        <path d={`M${CX} ${GY + 42} C${CX} 710 10 705 10 740`} />
        <path d="M10 740 L10 957" />
      </g>
      <g fill="none" stroke="#94a3b8" strokeWidth="1.6" className="eflow-line" markerEnd="url(#efah)">
        {OUTPUTS.map((o) => <path key={o.label} d={`M10 ${o.y + 17} L15 ${o.y + 17}`} />)}
      </g>

      {/* outputs */}
      <g fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700">
        {OUTPUTS.map((o) => (
          <g key={o.label}>
            <rect x="15" y={o.y} width="210" height="34" rx="8" fill="#fff" stroke="#86efac" strokeWidth="1.6" />
            <text x="27" y={o.y + 22} fontSize="13">{o.icon}</text>
            <text x="49" y={o.y + 21} fontSize="10.5" fill="#0f172a">{o.label}</text>
          </g>
        ))}
      </g>
    </svg>
  </div>
);
