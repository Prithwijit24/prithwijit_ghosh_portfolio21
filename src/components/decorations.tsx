import { useEffect, useRef, useState } from 'react';

/* ───────── Canvas data network ───────── */
export const DataNetworkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const PALETTE = [
      [244, 63, 94],   // rose
      [245, 158, 11],  // amber
      [16, 185, 129],  // emerald
      [14, 165, 233],  // sky
      [139, 92, 246],  // violet
    ];
    type P = { x: number; y: number; z: number; vx: number; vy: number; r: number; c: number[]; sx: number; sy: number };
    const particles: P[] = [];
    const COUNT = 78;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        z: 0.18 + Math.random() * 0.82,
        vx: (Math.random() - 0.5) * 0.62,
        vy: (Math.random() - 0.5) * 0.62,
        r: 1.5 + Math.random() * 2.4,
        c: PALETTE[(Math.random() * PALETTE.length) | 0],
        sx: 0, sy: 0
      });
    }

    const DIST = 150;
    const cam = { x: 0, y: 0 };
    let t = 0;
    let animId: number;
    const draw = () => {
      t += 1;
      ctx!.clearRect(0, 0, w, h);

      // gentle auto-sway + mouse parallax — nearer points shift more, revealing depth
      const targetX = Math.sin(t * 0.011) * 30 + (mouse.current.x > -9000 ? (mouse.current.x - w / 2) * 0.09 : 0);
      const targetY = Math.cos(t * 0.009) * 18 + (mouse.current.y > -9000 ? (mouse.current.y - h / 2) * 0.09 : 0);
      cam.x += (targetX - cam.x) * 0.16;
      cam.y += (targetY - cam.y) * 0.16;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.sx = p.x + cam.x * p.z;
        p.sy = p.y + cam.y * p.z;
      }

      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            const dz = (a.z + b.z) / 2;
            ctx!.beginPath();
            ctx!.moveTo(a.sx, a.sy);
            ctx!.lineTo(b.sx, b.sy);
            ctx!.strokeStyle = `rgba(71, 85, 105, ${(1 - d / DIST) * 0.55 * dz})`;
            ctx!.lineWidth = 0.6 + dz * 1.1;
            ctx!.stroke();
          }
        }
      }

      // draw far points first so nearer ones sit on top (depth ordering)
      const order = particles.slice().sort((a, b) => a.z - b.z);
      for (const p of order) {
        const [cr, cg, cb] = p.c;
        const size = p.r * (0.55 + p.z);
        const halo = size * 2.8;
        const a0 = 0.4 + p.z * 0.55;
        const grad = ctx!.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, halo);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${a0})`);
        grad.addColorStop(0.45, `rgba(${cr},${cg},${cb},${a0 * 0.45})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, halo, 0, Math.PI * 2);
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    const onMouse = (e: MouseEvent) => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    const onLeave = () => { mouse.current.x = -9999; mouse.current.y = -9999; };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
};

/* ───────── Decorative corner symbols per section ───────── */
type CornerIcons = { bottomLeft?: string; bottomRight?: string };
const SECTION_CORNERS: Record<string, CornerIcons> = {
  achievements: { bottomLeft: '🏆', bottomRight: '📈' },
  skills: { bottomLeft: '🔧', bottomRight: '⚡' },
  experience: { bottomLeft: '💼', bottomRight: '📋' },
  msc: { bottomLeft: '📐', bottomRight: '📊' },
  projects: { bottomLeft: '🧪', bottomRight: '🔬' },
  education: { bottomLeft: '🎓', bottomRight: '📜' },
  certifications: { bottomLeft: '📜', bottomRight: '🏅' },
  contact: { bottomLeft: '✉️', bottomRight: '📡' }
};

export const SectionCorners = ({ section }: { section: string }) => {
  const corners = SECTION_CORNERS[section];
  if (!corners) return null;
  return (
    <div className="section-corners" aria-hidden="true">
      {corners.bottomLeft && <span className="corner-icon corner-icon--bl">{corners.bottomLeft}</span>}
      {corners.bottomRight && <span className="corner-icon corner-icon--br">{corners.bottomRight}</span>}
    </div>
  );
};

export const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trail: { x: number; y: number }[] = [];
    const MAX_TRAIL = 12;

    const onMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 50}px, ${e.clientY - 50}px)`;
      }
      trail.push({ x: e.clientX, y: e.clientY });
      if (trail.length > MAX_TRAIL) trail.shift();
      if (trailRef.current) {
        const dots = trail.map((p, i) =>
          `<span class="trail-dot" style="left:${p.x}px;top:${p.y}px;opacity:${(i + 1) / MAX_TRAIL};transform:scale(${(i + 1) / MAX_TRAIL})" />`
        ).join('');
        trailRef.current.innerHTML = dots;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={trailRef} className="cursor-trail" aria-hidden="true" />
    </>
  );
};

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="scroll-progress-bar" aria-hidden="true">
      <div className="scroll-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
};

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button className={`back-to-top ${visible ? 'back-to-top--visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};
