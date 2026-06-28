import { AnimatedCounter } from '../primitives';

const linePath = (data: number[], yLim: [number, number] = [0, 1]) => {
  const [minY, maxY] = yLim;
  return data.map((v, i) => {
    const y = 30 - ((v - minY) / (maxY - minY)) * 30;
    return `${i === 0 ? 'M' : 'L'}${i * (100 / (data.length - 1))} ${y}`;
  }).join(' ');
};

const Sparkline = ({ data, yLim, color, accent }: { data: number[]; yLim?: [number, number]; color: string; accent: string }) => {
  const path = linePath(data, yLim);
  const pathId = `sparkline-path-${accent}`;
  return (
  <svg className="sparkline" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id={`grad-${accent}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <path
      id={pathId}
      d={path}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="sparkline-path"
    />
    <path
      d={`${path} V30 H0 Z`}
      fill={`url(#grad-${accent})`}
      className="sparkline-area"
    />
  </svg>
  );
};

const RadialGauge = ({ value, color }: { value: number; color: string }) => (
  <svg className="radial-gauge" viewBox="0 0 60 60" aria-hidden="true">
    <circle
      cx="30"
      cy="30"
      r="24"
      fill="none"
      stroke="rgba(0,0,0,0.06)"
      strokeWidth="6"
    />
    <circle
      cx="30"
      cy="30"
      r="24"
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      pathLength="100"
      strokeDasharray={`${value} 100`}
      transform="rotate(-90 30 30)"
      className="gauge-progress"
    >
      <animate
        attributeName="stroke-dasharray"
        dur="10s"
        repeatCount="indefinite"
        values={`0 100; ${value} 100; ${value} 100; 0 100`}
        keyTimes="0; .45; .82; 1"
        calcMode="spline"
        keySplines=".4 0 .2 1; 0 0 1 1; .4 0 .2 1"
      />
    </circle>
  </svg>
);

const MiniBars = ({ data, color }: { data: number[]; color: string }) => (
  <svg className="mini-bars" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
    <g>
      {data.map((v, i) => (
        <rect
          key={i}
          x={i * (100 / data.length) + 2}
          y={30}
          width={100 / data.length - 4}
          height={0}
          fill={color}
          rx={1}
          className="mini-bar"
        >
          <animate
            attributeName="height"
            dur="10s"
            begin={`${i * 0.45}s`}
            repeatCount="indefinite"
            values={`0; ${v * 28}; ${v * 28}; 0`}
            keyTimes="0; .25; .82; 1"
          />
          <animate
            attributeName="y"
            dur="10s"
            begin={`${i * 0.45}s`}
            repeatCount="indefinite"
            values={`30; ${30 - v * 28}; ${30 - v * 28}; 30`}
            keyTimes="0; .25; .82; 1"
          />
        </rect>
      ))}
    </g>
  </svg>
);

const AreaChart = ({ data, color }: { data: number[]; color: string }) => {
  const path = linePath(data);
  return (
  <svg className="area-chart" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.35} />
        <stop offset="100%" stopColor={color} stopOpacity={0.02} />
      </linearGradient>
    </defs>
    <path
      d={`${path} V30 H0 Z`}
      fill="url(#areaGrad)"
    />
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const HeroSignalPanel = () => (
  <div className="hero-panel">
    <div className="mac-titlebar">
      <div className="traffic-lights">
        <div className="traffic-light red" title="Close" aria-label="Close" />
        <div className="traffic-light yellow" title="Minimize" aria-label="Minimize" />
        <div className="traffic-light green" title="Zoom" aria-label="Zoom" />
      </div>
      <div className="mac-title">KPI Dashboard - Production Analytics</div>
    </div>

    <div className="kpi-grid">
      <article className="kpi-card kpi-card--accuracy">
        <header className="kpi-header"><span className="kpi-tag">Accuracy</span></header>
        <div className="kpi-main">
          <div className="kpi-value-row">
            <div className="kpi-counter"><AnimatedCounter target={99} suffix="%" />–<AnimatedCounter target={97} suffix="%" /></div>
            <Sparkline data={[0.97,0.96,0.97,0.95,0.98,0.99]} yLim={[0.94, 1]} color="#ef4444" accent="accuracy" />
          </div>
          <span className="kpi-label">24-month forecast accuracy</span>
        </div>
      </article>

      <article className="kpi-card kpi-card--models">
        <header className="kpi-header"><span className="kpi-tag">Models</span></header>
        <div className="kpi-main">
          <div className="kpi-value-row">
            <div className="kpi-counter"><AnimatedCounter target={450} suffix="+" /></div>
            <MiniBars data={[0.18,0.32,0.48,0.61,0.76,0.9,1]} color="#10b981" />
          </div>
          <span className="kpi-label">Forecasting models evaluated</span>
        </div>
      </article>

      <article className="kpi-card kpi-card--auc">
        <header className="kpi-header"><span className="kpi-tag">AUC</span></header>
        <div className="kpi-main">
          <div className="kpi-value-row">
            <div className="kpi-counter"><AnimatedCounter target={90} suffix="%" /></div>
            <RadialGauge value={90} color="#f59e0b" />
          </div>
          <span className="kpi-label">Due-month AUC</span>
        </div>
      </article>

      <article className="kpi-card kpi-card--cashflow">
        <header className="kpi-header"><span className="kpi-tag">Records</span></header>
        <div className="kpi-main">
          <div className="kpi-value-row">
            <div className="kpi-counter"><AnimatedCounter target={6} suffix="M+" /></div>
            <AreaChart data={[0.1,0.06,0.15,0.23,0.65,0.88,0.84]} color="#3b82f6" />
          </div>
          <span className="kpi-label">Cash-flow records processed</span>
        </div>
      </article>
    </div>

  </div>
);
