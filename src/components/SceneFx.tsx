import { useEffect, useRef } from 'react';

export type FxVariant = 'lattice' | 'flow' | 'wave' | 'helix' | 'orbits' | 'ripples';

// One canvas per section. Renders a distinct animated 3D structure behind the
// content at low opacity. Only animates while the section is on-screen
// (IntersectionObserver) and honours prefers-reduced-motion.
export const SceneFx = ({ variant, accent }: { variant: FxVariant; accent: number[] }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const [R, G, B] = accent;
    // GAIN lifts the per-element alphas so the structure actually reads on the
    // light pastel background (kept behind content + section cards).
    const GAIN = 2.1;
    const col = (a: number) => `rgba(${R},${G},${B},${Math.min(a * GAIN, 1)})`;

    let w = 0, h = 0;
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // shared rotateY + tiltX + perspective projection (object space ~[-1,1])
    const project = (x: number, y: number, z: number, ay: number, ax: number, scale: number) => {
      const X = x * Math.cos(ay) + z * Math.sin(ay);
      const Z1 = -x * Math.sin(ay) + z * Math.cos(ay);
      const Y2 = y * Math.cos(ax) - Z1 * Math.sin(ax);
      const Z2 = y * Math.sin(ax) + Z1 * Math.cos(ax);
      const s = 3.4 / (3.4 - Z2);
      return { sx: w / 2 + X * scale * s, sy: h / 2 + Y2 * scale * s, s };
    };

    const lattice: number[][] = [];
    if (variant === 'lattice') for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) lattice.push([i, j, k]);
    const flow: { x: number; y: number }[] = [];
    if (variant === 'flow') for (let i = 0; i < 130; i++) flow.push({ x: Math.random() * w, y: Math.random() * h });

    const dot = (x: number, y: number, r: number, a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, col(a)); g.addColorStop(1, col(0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    };

    let t = 0, raf = 0, running = false;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w, h) * 0.32;

      if (variant === 'lattice') {
        const ay = t * 0.006, ax = 0.5;
        const pts = lattice.map(([x, y, z]) => project(x, y, z, ay, ax, scale));
        ctx.lineWidth = 1;
        for (let a = 0; a < lattice.length; a++) for (let b = a + 1; b < lattice.length; b++) {
          const dsum = Math.abs(lattice[a][0] - lattice[b][0]) + Math.abs(lattice[a][1] - lattice[b][1]) + Math.abs(lattice[a][2] - lattice[b][2]);
          if (dsum === 1) {
            ctx.strokeStyle = col(0.16 * ((pts[a].s + pts[b].s) / 2));
            ctx.beginPath(); ctx.moveTo(pts[a].sx, pts[a].sy); ctx.lineTo(pts[b].sx, pts[b].sy); ctx.stroke();
          }
        }
        for (const p of pts) dot(p.sx, p.sy, 5 * p.s, 0.5 * p.s);
      } else if (variant === 'wave') {
        const cols = 18, rows = 12, ax = 0.95, ay = Math.sin(t * 0.003) * 0.3;
        const grid: { sx: number; sy: number; s: number }[][] = [];
        for (let r = 0; r < rows; r++) {
          const row: { sx: number; sy: number; s: number }[] = [];
          for (let c = 0; c < cols; c++) {
            const x = (c / (cols - 1) - 0.5) * 2.1, z = (r / (rows - 1) - 0.5) * 2.1;
            const y = Math.sin(x * 3 + t * 0.04) * 0.18 + Math.cos(z * 3 + t * 0.03) * 0.18;
            row.push(project(x, y, z, ay, ax, scale));
          }
          grid.push(row);
        }
        ctx.lineWidth = 1;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const p = grid[r][c];
          if (c < cols - 1) { const q = grid[r][c + 1]; ctx.strokeStyle = col(0.15 * p.s); ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke(); }
          if (r < rows - 1) { const q = grid[r + 1][c]; ctx.strokeStyle = col(0.15 * p.s); ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke(); }
        }
      } else if (variant === 'flow') {
        for (const p of flow) {
          const ang = Math.sin(p.x * 0.006) + Math.cos(p.y * 0.006) + t * 0.01;
          const vx = Math.cos(ang) * 2.4, vy = Math.sin(ang) * 2.4;
          ctx.strokeStyle = col(0.16); ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + vx * 3, p.y + vy * 3); ctx.stroke();
          p.x += vx; p.y += vy;
          if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) { p.x = Math.random() * w; p.y = Math.random() * h; }
        }
      } else if (variant === 'helix') {
        const ay = t * 0.01, ax = 0.2, num = 44;
        const a: { sx: number; sy: number; s: number }[] = [], b: { sx: number; sy: number; s: number }[] = [];
        for (let i = 0; i < num; i++) {
          const yy = (i / (num - 1) - 0.5) * 2.3, th = i * 0.5 + t * 0.02;
          a.push(project(Math.cos(th), yy, Math.sin(th), ay, ax, scale * 0.78));
          b.push(project(Math.cos(th + Math.PI), yy, Math.sin(th + Math.PI), ay, ax, scale * 0.78));
        }
        ctx.lineWidth = 1.1;
        for (let i = 0; i < num - 1; i++) {
          ctx.strokeStyle = col(0.3 * a[i].s); ctx.beginPath(); ctx.moveTo(a[i].sx, a[i].sy); ctx.lineTo(a[i + 1].sx, a[i + 1].sy); ctx.stroke();
          ctx.strokeStyle = col(0.3 * b[i].s); ctx.beginPath(); ctx.moveTo(b[i].sx, b[i].sy); ctx.lineTo(b[i + 1].sx, b[i + 1].sy); ctx.stroke();
        }
        for (let i = 0; i < num; i += 2) { ctx.strokeStyle = col(0.12); ctx.beginPath(); ctx.moveTo(a[i].sx, a[i].sy); ctx.lineTo(b[i].sx, b[i].sy); ctx.stroke(); }
        for (const p of a.concat(b)) dot(p.sx, p.sy, 4 * p.s, 0.5 * p.s);
      } else if (variant === 'orbits') {
        const cx = w / 2, cy = h / 2, Rr = Math.min(w, h) * 0.3;
        const rings: [number, number][] = [[0, 0.42], [1.0, 0.6], [2.1, 0.5]];
        ctx.lineWidth = 1;
        rings.forEach(([rot, tilt], idx) => {
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
          ctx.strokeStyle = col(0.18); ctx.beginPath(); ctx.ellipse(0, 0, Rr, Rr * tilt, 0, 0, 7); ctx.stroke();
          const ang = t * 0.03 * (idx + 1);
          dot(Math.cos(ang) * Rr, Math.sin(ang) * Rr * tilt, 9, 0.7);
          ctx.restore();
        });
        dot(cx, cy, 16, 0.55);
      } else if (variant === 'ripples') {
        const cx = w / 2, cy = h * 0.46, max = Math.max(w, h) * 0.6;
        ctx.lineWidth = 1.4;
        for (let i = 0; i < 5; i++) {
          const prog = (t * 0.8 + i * (max / 5)) % max;
          const a = 0.28 * (1 - prog / max);
          if (a > 0) { ctx.strokeStyle = col(a); ctx.beginPath(); ctx.arc(cx, cy, prog, 0, 7); ctx.stroke(); }
        }
        dot(cx, cy, 6, 0.5);
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver((entries) => {
      const vis = entries[0].isIntersecting;
      if (vis && !running && !reduce) { running = true; raf = requestAnimationFrame(draw); }
      else if (!vis && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0 });
    io.observe(canvas);

    if (reduce) draw();

    return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize); };
  }, [variant, accent]);

  return <canvas ref={ref} className="scene-fx" aria-hidden="true" />;
};
