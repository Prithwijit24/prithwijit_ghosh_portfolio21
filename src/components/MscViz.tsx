// Left  (HyperCubeViz): a true 4-D tesseract rotating in the X–W plane — the
//   inner cube swells out to become the outer cube and the cycle loops, proving
//   it is neither 2-D nor 3-D. Red & blue points sit at random 4-D positions
//   inside it, tumbling through the structure thoroughly intermixed.
// Right (DDPlotViz): the custom glossy robust Depth–Depth plot, where the two
//   classes separate cleanly (after the thesis figures).
import { useEffect, useRef } from 'react';

const AXIS = '#4d4d4d';
const TICKS = [0, 0.2, 0.4, 0.6, 0.8, 1];

// deterministic pseudo-random in [0,1)
const rnd = (s: number) => { const x = Math.sin(s * 127.1) * 43758.5453; return x - Math.floor(x); };
const clamp = (v: number) => Math.max(0.02, Math.min(0.98, v));

const RED = { lo: '#ffdede', mid: '#ff2727', hi: '#9c000f' };
const BLUE = { lo: '#dcefff', mid: '#2f9be8', hi: '#0f4c8a' };

// 16 tesseract vertices (±1)^4 and the 32 edges (differ in exactly one coord)
const TES_V: number[][] = [];
for (let i = 0; i < 16; i++) TES_V.push([(i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1]);
const TES_E: [number, number][] = [];
for (let a = 0; a < 16; a++) for (let b = a + 1; b < 16; b++) {
  let diff = 0; for (let k = 0; k < 4; k++) if (TES_V[a][k] !== TES_V[b][k]) diff++;
  if (diff === 1) TES_E.push([a, b]);
}
// data points at random 4-D positions, two classes alternating → intermixed
const TES_PTS = Array.from({ length: 42 }, (_, i) => ({
  p: [0, 1, 2, 3].map((j) => rnd(i * 4 + j + 1) * 1.7 - 0.85),
  cls: (i % 2) as 0 | 1,
}));

// rotate in the X–W plane (the 4-D turn) plus a gentle 3-D tumble, then project
// 4-D → 3-D → 2-D with perspective
const projTesseract = (v: number[], aw: number, ax: number, ay: number) => {
  let [x, y, z, w] = v;
  let c = Math.cos(aw), s = Math.sin(aw);
  [x, w] = [x * c - w * s, x * s + w * c];
  c = Math.cos(ay); s = Math.sin(ay);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(ax); s = Math.sin(ax);
  [x, z] = [x * c - z * s, x * s + z * c];
  const k4 = 1 / (2.7 - w);        // 4-D perspective: high-w vertices read as the outer cube
  x *= k4; y *= k4; z *= k4;
  const k3 = 1 / (3.2 - z);        // 3-D perspective
  return { x: x * k3, y: y * k3, k: k3 };
};

export const HyperCubeViz = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, w = 0, h = 0, running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const cssW = canvas.clientWidth || 300;
      const cssH = cssW * 5 / 6;
      w = cssW; h = cssH;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (time: number) => {
      const aw = reduce ? 0.6 : time * 0.00045;
      const ax = reduce ? 0.5 : time * 0.00016;
      const ay = reduce ? 0.3 : time * 0.00011;
      const S = Math.min(w, h) * 1.35;
      const cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      const vp = TES_V.map((v) => projTesseract(v, aw, ax, ay));
      // edges, faded a touch by depth
      ctx.lineWidth = 1;
      for (const [a, b] of TES_E) {
        const pa = vp[a], pb = vp[b];
        ctx.strokeStyle = `rgba(120,130,148,${0.28 + 0.42 * ((pa.k + pb.k) / 2 - 0.27) / 0.12})`;
        ctx.beginPath();
        ctx.moveTo(cx + pa.x * S, cy + pa.y * S);
        ctx.lineTo(cx + pb.x * S, cy + pb.y * S);
        ctx.stroke();
      }
      // points — depth-sorted so nearer ones sit on top, glossy + perspective-scaled
      const pts = TES_PTS.map((d) => ({ ...projTesseract(d.p, aw, ax, ay), cls: d.cls }))
        .sort((m, n) => m.k - n.k);
      for (const pt of pts) {
        const px = cx + pt.x * S, py = cy + pt.y * S;
        const r = 3 + (pt.k - 0.27) / 0.12 * 3.6;
        const col = pt.cls === 0 ? RED : BLUE;
        const g = ctx.createRadialGradient(px - r * 0.35, py - r * 0.4, r * 0.15, px, py, r);
        g.addColorStop(0, col.lo); g.addColorStop(0.42, col.mid); g.addColorStop(1, col.hi);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.72)';
        ctx.beginPath(); ctx.ellipse(px - r * 0.3, py - r * 0.38, r * 0.34, r * 0.2, 0, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce && running) raf = requestAnimationFrame(draw);
    };

    // only animate while the tesseract is on-screen
    const io = new IntersectionObserver((entries) => {
      const vis = entries[0].isIntersecting;
      if (reduce) { if (vis) raf = requestAnimationFrame(draw); return; }
      if (vis && !running) { running = true; raf = requestAnimationFrame(draw); }
      else if (!vis && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0 });
    io.observe(canvas);

    return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <canvas ref={ref} className="msc-canvas" role="img"
      aria-label="A rotating 4-D tesseract: the inner cube continuously swells out to become the outer cube, with red and blue data points intermixed throughout, showing the two classes are non-separable in high dimensions." />
  );
};

/* ─── Right: custom glossy DD plot ───
   The contaminated class is drawn in vivid red; the ~10% genuinely corrupted
   observations (pulled toward the origin) glow. The clean class is glossy blue,
   and a dashed boundary shows the two are cleanly separable. */
const CONTAM = 10; // % of cells contaminated
const DX0 = 44, DXR = 320, DYT = 34, DYB = 250;
const dpx = (v: number) => DX0 + v * (DXR - DX0);
const dpy = (v: number) => DYB - v * (DYB - DYT);

type DPt = { x: number; y: number };
const M = 44;
const RED_PTS: DPt[] = []; // contaminated class — fan along the bottom
for (let k = 0; k < M; k++) {
  const t = k / (M - 1);
  const spread = 0.03 + t * 0.08;
  RED_PTS.push({ x: clamp(0.04 + t * 0.6 + (rnd(k * 1.7) - 0.5) * 0.05), y: clamp(0.05 + t * 0.11 + (rnd(k * 2.3 + 9) - 0.5) * spread * 2) });
}
const BLUE_PTS: DPt[] = []; // clean class — vertical plume
for (let k = 0; k < M; k++) {
  const s = k / (M - 1);
  BLUE_PTS.push({ x: clamp(0.3 + (rnd(k * 3.1 + 4) - 0.5) * 0.16), y: clamp(0.26 + s * 0.36 + (rnd(k * 1.3 + 7) - 0.5) * 0.05) });
}

const GlossyDot = ({ x, y, grad, r = 5 }: { x: number; y: number; grad: string; r?: number }) => (
  <g filter="url(#ddDrop)">
    <circle cx={x} cy={y} r={r} fill={`url(#${grad})`} />
    <ellipse cx={x - r * 0.32} cy={y - r * 0.38} rx={r * 0.42} ry={r * 0.26} fill="#fff" opacity="0.75" />
  </g>
);

export const DDPlotViz = () => (
  <svg viewBox="0 0 360 300" preserveAspectRatio="xMidYMid meet" role="img"
    aria-label="Robust Depth-Depth space: the contaminated class is highlighted in red and cleanly separated from the clean class by a decision boundary"
    fontFamily="ui-sans-serif,system-ui,sans-serif">
    <defs>
      <linearGradient id="ddPanel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#eef2f7" />
      </linearGradient>
      <radialGradient id="ddRed" cx="34%" cy="28%" r="78%">
        <stop offset="0" stopColor="#ffdede" /><stop offset="36%" stopColor="#ff2727" /><stop offset="100%" stopColor="#9c000f" />
      </radialGradient>
      <radialGradient id="ddBlue" cx="34%" cy="28%" r="78%">
        <stop offset="0" stopColor="#dcefff" /><stop offset="42%" stopColor="#2f9be8" /><stop offset="100%" stopColor="#0f4c8a" />
      </radialGradient>
      <filter id="ddDrop" x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow dx="0" dy="1.3" stdDeviation="1.3" floodColor="#0f172a" floodOpacity="0.3" />
      </filter>
    </defs>

    <rect x={DX0} y={DYT} width={DXR - DX0} height={DYB - DYT} rx="6" fill="url(#ddPanel)" stroke="rgba(15,23,42,.1)" />
    {TICKS.map((t) => <line key={`gx${t}`} x1={dpx(t)} y1={DYT} x2={dpx(t)} y2={DYB} stroke="#0f172a" strokeOpacity="0.05" />)}
    {TICKS.map((t) => <line key={`gy${t}`} x1={DX0} y1={dpy(t)} x2={DXR} y2={dpy(t)} stroke="#0f172a" strokeOpacity="0.05" />)}
    {TICKS.map((t) => <text key={`tx${t}`} x={dpx(t)} y={DYB + 13} textAnchor="middle" fontSize="8" fill={AXIS}>{t.toFixed(1)}</text>)}
    {TICKS.map((t) => <text key={`ty${t}`} x={DX0 - 6} y={dpy(t) + 3} textAnchor="end" fontSize="8" fill={AXIS}>{t.toFixed(1)}</text>)}
    <text x={(DX0 + DXR) / 2} y={DYB + 26} textAnchor="middle" fontSize="9.5" fill={AXIS}>depth → class 1</text>
    <text x={13} y={(DYT + DYB) / 2} textAnchor="middle" fontSize="9.5" fill={AXIS} transform={`rotate(-90 13 ${(DYT + DYB) / 2})`}>depth → class 2</text>

    {/* decision boundary */}
    <path d={`M${dpx(0)} ${dpy(0.30)} Q ${dpx(0.4)} ${dpy(0.17)} ${dpx(0.78)} ${dpy(0.30)}`} fill="none" stroke="#10b981" strokeWidth="1.8" strokeDasharray="6 4" opacity="0.85" />
    <text x={dpx(0.58)} y={dpy(0.34)} fontSize="8" fontWeight="700" fill="#0f9d6e">decision boundary</text>

    {/* clean class */}
    {BLUE_PTS.map((p, i) => <GlossyDot key={`b${i}`} x={dpx(p.x)} y={dpy(p.y)} grad="ddBlue" />)}
    {/* contaminated class */}
    {RED_PTS.map((p, i) => <GlossyDot key={`r${i}`} x={dpx(p.x)} y={dpy(p.y)} grad="ddRed" />)}

    {/* legend */}
    <rect x={DX0 + 7} y={DYT + 7} width="198" height="40" rx="8" fill="rgba(255,255,255,.88)" stroke="rgba(15,23,42,.1)" />
    <GlossyDot x={DX0 + 21} y={DYT + 21} grad="ddRed" r={4.6} />
    <text x={DX0 + 32} y={DYT + 24} fontSize="8.5" fontWeight="700" fill="#b91c1c">Contaminated class (contamination {CONTAM}%)</text>
    <GlossyDot x={DX0 + 21} y={DYT + 37} grad="ddBlue" r={4.6} />
    <text x={DX0 + 32} y={DYT + 40} fontSize="8.5" fontWeight="700" fill="#1d4ed8">Clean class</text>
  </svg>
);
