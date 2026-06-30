// Per-project architecture diagrams, distilled from each real GitHub repo.
// Each is intentionally non-linear (fan-out / converge / loops / gates) and
// renders to the right of its project card.

const PAL: Record<string, [string, string]> = {
  mint: ['#34d399', '#10b981'],
  sky: ['#38bdf8', '#0284c7'],
  violet: ['#a78bfa', '#7c3aed'],
  rose: ['#fb7185', '#e11d48'],
  amber: ['#fbbf24', '#d97706'],
  slate: ['#cbd5e1', '#94a3b8'],
};

const Defs = ({ p }: { p: string }) => (
  <defs>
    <marker id={`${p}ah`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#94a3b8" /></marker>
    <filter id={`${p}sh`} x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1e293b" floodOpacity="0.16" /></filter>
    {Object.entries(PAL).map(([k, [c1, c2]]) => (
      <radialGradient key={k} id={`${p}-${k}`} cx="32%" cy="22%" r="95%">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="48%" stopColor={c1} stopOpacity="0.42" />
        <stop offset="100%" stopColor={c2} stopOpacity="0.6" />
      </radialGradient>
    ))}
  </defs>
);

type NodeT = { p: string; x: number; y: number; w: number; h: number; g: string; label: string; icon?: string; fs?: number; delay?: number };
const Node = ({ p, x, y, w, h, g, label, fs = 10.5, delay = 0 }: NodeT) => {
  const rx = Math.min(13, h / 2.4);
  const cx = x + w / 2;
  return (
    <g className="parch-node" style={{ animationDelay: `${delay}s` }}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${p}-${g})`} stroke="rgba(255,255,255,.6)" strokeWidth="1.1" filter={`url(#${p}sh)`} />
      <ellipse cx={cx} cy={y + h * 0.27} rx={w * 0.4} ry={h * 0.15} fill="rgba(255,255,255,.4)" />
      <text x={cx} y={y + h / 2 + 3.5} textAnchor="middle" fontSize={fs} fontWeight="700" fill="#0f172a" fontFamily="ui-sans-serif,system-ui,sans-serif">{label}</text>
    </g>
  );
};

const E = ({ p, d, c = '#94a3b8' }: { p: string; d: string; c?: string }) => (
  <path d={d} fill="none" stroke={c} strokeWidth="1.5" className="eflow-line" markerEnd={`url(#${p}ah)`} />
);

const Gate = ({ p, cx, cy, r = 25, label }: { p: string; cx: number; cy: number; r?: number; label: string }) => (
  <g>
    <g filter={`url(#${p}sh)`}>
      <polygon points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} fill={`url(#${p}-violet)`} stroke="rgba(255,255,255,.7)" strokeWidth="1.2" />
    </g>
    <text x={cx} y={cy + 3} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0f172a" fontFamily="ui-sans-serif,system-ui,sans-serif">{label}</text>
  </g>
);

/* 1 ── Agentic Product Recommender ──────────────────────────────────── */
const Recommender = () => {
  const p = 'r';
  return (
    <div className="experience-flow">
      <svg viewBox="0 0 480 290" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Recommender architecture">
        <Defs p={p} />
        <E p={p} d="M53 60 L53 78" />
        <E p={p} d="M53 110 L53 128" />
        <E p={p} d="M100 138 C112 138 112 49 124 49" />
        <E p={p} d="M100 144 C112 144 112 99 124 99" />
        <E p={p} d="M100 150 C112 150 114 149 124 149" />
        <E p={p} d="M210 49 C228 49 228 90 244 90" />
        <E p={p} d="M210 99 C228 99 230 101 244 101" />
        <E p={p} d="M210 149 C228 149 230 112 244 112" />
        <E p={p} d="M234 216 C272 208 290 150 296 124" />
        <E p={p} d="M292 124 C292 150 294 152 296 176" />
        <E p={p} d="M308 176 C318 150 318 140 308 124" />
        <E p={p} d="M352 101 L372 101" />
        <Node p={p} x={6} y={28} w={94} h={32} g="slate" label="User Image" delay={0} />
        <Node p={p} x={6} y={78} w={94} h={32} g="slate" label="Face Crop" delay={0.2} />
        <Node p={p} x={6} y={128} w={94} h={32} g="mint" label="Embed · PCA" delay={0.4} />
        <Node p={p} x={124} y={34} w={86} h={30} g="slate" label="Age" delay={0.6} />
        <Node p={p} x={124} y={84} w={86} h={30} g="slate" label="Gender" delay={0.7} />
        <Node p={p} x={124} y={134} w={86} h={30} g="slate" label="Race" delay={0.8} />
        <Node p={p} x={124} y={206} w={114} h={32} g="slate" label="Preferences" delay={1} />
        <Node p={p} x={244} y={78} w={108} h={46} g="violet" label="LangChain Agent" delay={0.9} />
        <Node p={p} x={250} y={176} w={104} h={30} g="sky" label="Tavily Search" delay={1.1} />
        <Node p={p} x={372} y={82} w={102} h={38} g="slate" label="Product Picks" delay={1.2} />
      </svg>
      <figcaption className="arch-caption">Facial demographics feed an LLM agent that web-searches and recommends products.</figcaption>
    </div>
  );
};

/* 2 ── Credit Card Fraud Detection ──────────────────────────────────── */
const Fraud = () => {
  const p = 'f';
  return (
    <div className="experience-flow">
      <svg viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Fraud detection architecture">
        <Defs p={p} />
        {/* stream lane */}
        <E p={p} d="M80 35 L92 35" />
        <E p={p} d="M160 35 L172 35" />
        <E p={p} d="M264 35 L305 35" />
        <E p={p} d="M355 35 C374 35 374 20 392 20" />
        <E p={p} d="M355 35 C374 35 374 62 392 62" />
        {/* shared store + model */}
        <E p={p} d="M218 50 C218 92 224 104 224 128" />
        <E p={p} d="M272 143 L300 143" />
        <E p={p} d="M352 128 C352 80 250 62 218 50" />
        {/* training lane */}
        <E p={p} d="M84 225 L96 225" />
        <E p={p} d="M170 225 L182 225" />
        <E p={p} d="M256 225 L268 225" />
        <E p={p} d="M346 225 L367 225" />
        <E p={p} d="M219 210 C219 180 224 168 224 158" />
        <E p={p} d="M392 200 C392 172 352 170 352 158" />
        <E p={p} d="M404 240 C428 254 446 258 452 260" />
        <text x="343" y="11" fontSize="8" fontWeight="700" fill="#e11d48" fontFamily="ui-sans-serif,system-ui">high risk</text>
        <text x="368" y="180" fontSize="8" fontWeight="700" fill="#047857" fontFamily="ui-sans-serif,system-ui">promote</text>
        <Gate p={p} cx={330} cy={35} label="risk?" />
        <Gate p={p} cx={392} cy={225} label="gate" />
        <Node p={p} x={6} y={20} w={74} h={30} g="slate" label="Producer" fs={9.5} />
        <Node p={p} x={92} y={20} w={68} h={30} g="amber" label="Kafka" fs={9.5} delay={0.2} />
        <Node p={p} x={172} y={20} w={92} h={30} g="violet" label="Scorer" fs={9.5} delay={0.4} />
        <Node p={p} x={392} y={6} w={102} h={28} g="slate" label="Alert Sink" fs={9.5} delay={0.6} />
        <Node p={p} x={392} y={48} w={102} h={28} g="slate" label="Scored Sink" fs={9.5} delay={0.7} />
        <Node p={p} x={176} y={128} w={96} h={30} g="amber" label="DuckDB" fs={9.5} delay={0.5} />
        <Node p={p} x={300} y={128} w={104} h={30} g="mint" label="model.joblib" fs={9} delay={0.6} />
        <Node p={p} x={6} y={210} w={78} h={30} g="slate" label="Historical" fs={9.5} delay={0.3} />
        <Node p={p} x={96} y={210} w={74} h={30} g="slate" label="Validate" fs={9.5} delay={0.4} />
        <Node p={p} x={182} y={210} w={74} h={30} g="slate" label="Features" fs={9.5} delay={0.5} />
        <Node p={p} x={268} y={210} w={78} h={30} g="slate" label="CV" fs={9.5} delay={0.6} />
        <Node p={p} x={452} y={248} w={44} h={26} g="slate" label="Abort" fs={9} delay={0.8} />
      </svg>
      <figcaption className="arch-caption">Kafka stream-scoring and a training pipeline share one feature store and model.</figcaption>
    </div>
  );
};

/* 3 ── Agentic Travel Planner ───────────────────────────────────────── */
const Travel = () => {
  const p = 't';
  return (
    <div className="experience-flow">
      <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Travel planner architecture">
        <Defs p={p} />
        <E p={p} d="M64 147 L74 147" />
        <E p={p} d="M148 147 L158 147" />
        <E p={p} d="M232 147 L242 147" />
        <E p={p} d="M336 135 C348 135 348 53 360 53" />
        <E p={p} d="M336 141 C348 141 348 93 360 93" />
        <E p={p} d="M336 147 C348 147 350 133 360 133" />
        <E p={p} d="M289 164 C289 185 300 186 302 200" />
        <E p={p} d="M302 228 L302 238" />
        <E p={p} d="M362 250 C374 250 374 239 384 239" />
        <E p={p} d="M384 247 C366 258 326 258 312 254" />
        <E p={p} d="M242 252 C196 252 196 150 242 150" />
        <Node p={p} x={6} y={132} w={58} h={30} g="slate" label="User" fs={9.5} />
        <Node p={p} x={74} y={132} w={74} h={30} g="slate" label="UI / CLI" fs={9.5} delay={0.2} />
        <Node p={p} x={158} y={132} w={74} h={30} g="sky" label="FastAPI" fs={9.5} delay={0.4} />
        <Node p={p} x={242} y={118} w={94} h={46} g="mint" label="LangGraph" fs={10} delay={0.6} />
        <Node p={p} x={360} y={40} w={114} h={26} g="slate" label="Route worker" fs={9.5} delay={0.8} />
        <Node p={p} x={360} y={80} w={114} h={26} g="slate" label="Budget worker" fs={9.5} delay={0.9} />
        <Node p={p} x={360} y={120} w={114} h={26} g="slate" label="Timing worker" fs={9.5} delay={1} />
        <Node p={p} x={242} y={200} w={120} h={28} g="slate" label="Web · Weather" fs={9} delay={0.7} />
        <Node p={p} x={242} y={238} w={120} h={28} g="violet" label="Retrieve · Rerank" fs={8.5} delay={0.8} />
        <Node p={p} x={384} y={224} w={90} h={30} g="mint" label="Chroma KB" fs={9} delay={0.9} />
      </svg>
      <figcaption className="arch-caption">A LangGraph hub delegates to route, budget &amp; timing workers over a retrieval base.</figcaption>
    </div>
  );
};

/* 4 ── Music Recommendation (PulseMix) ──────────────────────────────── */
const Music = () => {
  const p = 'm';
  return (
    <div className="experience-flow">
      <svg viewBox="0 0 480 240" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Music recommendation architecture">
        <Defs p={p} />
        <E p={p} d="M102 120 L116 120" />
        <E p={p} d="M200 120 C208 80 208 33 214 33" />
        <E p={p} d="M200 120 C208 100 208 75 214 75" />
        <E p={p} d="M200 120 C208 140 208 163 214 163" />
        <E p={p} d="M200 120 C208 165 208 205 214 205" />
        <E p={p} d="M334 33 C344 33 344 104 352 104" />
        <E p={p} d="M334 75 C344 75 346 110 352 110" />
        <E p={p} d="M334 163 C344 163 346 120 352 120" />
        <E p={p} d="M334 205 C344 205 346 126 352 126" />
        <E p={p} d="M412 136 L412 150" />
        <Node p={p} x={6} y={104} w={96} h={32} g="slate" label="Song DS" fs={9.5} />
        <Node p={p} x={116} y={104} w={84} h={32} g="slate" label="Features" fs={9.5} delay={0.2} />
        <Node p={p} x={214} y={20} w={120} h={26} g="violet" label="Content-based" fs={9.5} delay={0.4} />
        <Node p={p} x={214} y={62} w={120} h={26} g="violet" label="Collaborative" fs={9.5} delay={0.5} />
        <Node p={p} x={214} y={150} w={120} h={26} g="mint" label="Deep Learning" fs={9.5} delay={0.6} />
        <Node p={p} x={214} y={192} w={120} h={26} g="mint" label="Classical ML" fs={9.5} delay={0.7} />
        <Node p={p} x={352} y={92} w={120} h={44} g="violet" label="Hybrid Rank" fs={10} delay={0.8} />
        <Node p={p} x={352} y={150} w={120} h={28} g="sky" label="Streamlit UI" fs={9.5} delay={1} />
      </svg>
      <figcaption className="arch-caption">Content, collaborative &amp; deep models converge into a hybrid ranker.</figcaption>
    </div>
  );
};

export type ArchKind = 'recommender' | 'fraud' | 'travel' | 'music';

export const ProjectArch = ({ kind }: { kind: ArchKind }) => {
  switch (kind) {
    case 'recommender': return <Recommender />;
    case 'fraud': return <Fraud />;
    case 'travel': return <Travel />;
    case 'music': return <Music />;
  }
};
