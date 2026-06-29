import { type ReactNode, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { SpringAccent } from '../theme';

type TiltCardProps = { children: ReactNode; className?: string };

export const TiltCard = ({ children, className = '' }: TiltCardProps) => (
  <div className={`tilt-card ${className}`}>
    <div className="tilt-card-layer">{children}</div>
  </div>
);

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
    <div ref={domRef} className={`fade-in fade-in--${direction} ${isVisible ? 'fade-in--visible' : ''}`} style={{ transitionDelay: `${delay * 0.18}ms` }}>
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
