import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import type { SpringAccent } from '../theme';

type TiltCardProps = { children: ReactNode; className?: string };

export const TiltCard = ({ children, className = '' }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({});
  const [glare, setGlare] = useState<{ x: number; y: number; o: number }>({ x: 50, y: 50, o: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1
    const py = (e.clientY - rect.top) / rect.height;   // 0..1
    const x = px - 0.5;
    const y = py - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) translateZ(8px)`,
      transition: 'transform 0.08s ease-out'
    });
    setGlare({ x: px * 100, y: py * 100, o: 0.25 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)'
    });
    setGlare((g) => ({ ...g, o: 0 }));
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tilt-card-layer" style={{ transform: 'translateZ(2rem)' }}>
        {children}
      </div>
      <span
        className="tilt-card-glare"
        aria-hidden="true"
        style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.o}), transparent 60%)` }}
      />
    </div>
  );
};

export const SectionHeading = ({ emoji, title }: { emoji: string; title: string }) => (
  <div className="section-heading">
    <span className="section-heading-icon" aria-hidden="true">{emoji}</span>
    <h3 className="text-3xl font-bold spring-gradient-text">{title}</h3>
  </div>
);

type FadeInProps = { children: ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'scale' };

export const FadeIn = ({ children, delay = 0, direction = 'up' }: FadeInProps) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); } }, { rootMargin: '0px 0px -80px 0px' });
    const node = domRef.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={domRef} className={`fade-in fade-in--${direction} ${isVisible ? 'fade-in--visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

type AnimatedCounterProps = { target: number; suffix?: string; prefix?: string; duration?: number };

export const AnimatedCounter = ({ target, suffix = '', prefix = '', duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const startTime = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !hasStarted) { setHasStarted(true); observer.unobserve(entry.target); } }, { rootMargin: '0px 0px -50px 0px' });
    const node = ref.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [hasStarted, target, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

type SkillBarProps = { level: number; accent: SpringAccent };

export const SkillBar = ({ level, accent }: SkillBarProps) => {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { requestAnimationFrame(() => setWidth(level)); observer.unobserve(entry.target); } }, { rootMargin: '0px 0px -50px 0px' });
    const node = ref.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [level]);
  return (
    <div ref={ref} className={`skill-bar skill-bar--${accent}`}>
      <div className={`skill-bar-fill skill-bar-fill--${accent}`} style={{ width: `${width}%` }} />
    </div>
  );
};

/* ───────── Reveal: scroll-driven 3D entrance ───────── */
type RevealProps = {
  children: ReactNode;
  delay?: number;
  rotateY?: number;     // entrance rotateY in degrees (default -25)
  className?: string;
};

export const Reveal = ({ children, delay = 0, rotateY = -25, className = '' }: RevealProps) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); }
    }, { rootMargin: '0px 0px -80px 0px' });
    const node = ref.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, '--reveal-rotate-y': `${rotateY}deg` } as CSSProperties}
    >
      {children}
    </div>
  );
};

/* ───────── Scene3D: establishes a perspective + preserve-3d context ───────── */
type Scene3DProps = { children: ReactNode; className?: string; depth?: number };

export const Scene3D = ({ children, className = '', depth = 1000 }: Scene3DProps) => (
  <div className={`scene-3d ${className}`} style={{ perspective: `${depth}px` }}>
    <div className="scene-3d-inner" style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  </div>
);
