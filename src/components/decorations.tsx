import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { DS_ICONS } from '../data';

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

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const COUNT = 70;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random() * 2.5
      });
    }

    let animId: number;
    const draw = () => {
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= dx * 0.02;
          p.y -= dy * 0.02;
        }
      }

      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(251,113,133,${(1 - d / 140) * 0.25})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
        grad.addColorStop(0, 'rgba(251,113,133,0.7)');
        grad.addColorStop(0.5, 'rgba(52,211,153,0.4)');
        grad.addColorStop(1, 'rgba(56,189,248,0)');
        ctx!.fillStyle = grad;
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

/* ───────── Data science floating icons ───────── */
export const DataFloatIcons = () => {
  const icons = useMemo(() =>
    DS_ICONS.map((ic, i) => ({
      icon: ic,
      left: `${(i * 7.3 + 2) % 100}%`,
      delay: `${(i * -1.4) % 10}s`,
      duration: `${14 + (i * 0.9) % 8}s`,
      size: `${1.2 + (i * 0.15) % 1.2}rem`
    })), []);
  return (
    <div className="data-float-icons" aria-hidden="true">
      {icons.map(({ icon, left, delay, duration, size }) => (
        <span key={icon} className="data-float-icon" style={{ left, animationDelay: delay, animationDuration: duration, fontSize: size }}>{icon}</span>
      ))}
    </div>
  );
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

/* ───────── Large education scholar icon ───────── */
export const ScholarDecor = () => (
  <div className="scholar-decor" aria-hidden="true">
    <div className="scholar-hat">
      <svg viewBox="0 0 120 80" className="scholar-svg">
        <defs>
          <linearGradient id="hatGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="hatGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <path d="M60 5 L5 35 L60 65 L115 35 Z" fill="url(#hatGrad)" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M60 15 L20 37 L60 59 L100 37 Z" fill="url(#hatGrad)" opacity="0.5">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" begin="1s" repeatCount="indefinite" />
        </path>
        <path d="M60 25 L35 39 L60 53 L85 39 Z" fill="url(#hatGrad)" opacity="0.7">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="4s" begin="2s" repeatCount="indefinite" />
        </path>
        <rect x="57" y="60" width="6" height="15" fill="url(#hatGrad2)" opacity="0.6" rx="2">
          <animate attributeName="height" values="12;16;12" dur="3s" repeatCount="indefinite" />
        </rect>

        <circle cx="60" cy="35" r="18" fill="none" stroke="rgba(251,113,133,0.2)" strokeWidth="1.5">
          <animate attributeName="r" values="16;22;16" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="35" r="10" fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth="1.5">
          <animate attributeName="r" values="8;14;8" dur="5s" begin="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.6;0.25" dur="5s" begin="1.5s" repeatCount="indefinite" />
        </circle>

        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <text key={i} x={60 + Math.cos(angle * Math.PI / 180) * 28} y={35 + Math.sin(angle * Math.PI / 180) * 28}
            textAnchor="middle" dominantBaseline="central" fontSize="10" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            {['📊','📈','🧮','📉','🔢','💡'][i]}
          </text>
        ))}
      </svg>
    </div>
    <div className="scholar-ring">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <span key={i} className="scholar-ring-icon" style={{ '--i': i } as CSSProperties}>
          {['🎓','📚','📐','📊','🧮','📜','🔬','💡'][i]}
        </span>
      ))}
    </div>
  </div>
);

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
