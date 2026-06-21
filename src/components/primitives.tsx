import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import type { SpringAccent } from '../theme';

type TiltCardProps = { children: ReactNode; className?: string };

export const TiltCard = ({ children, className = '' }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateZ(6px)`,
      transition: 'transform 0.1s ease-out'
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.5s ease-out'
    });
  }, []);

  return (
    <div ref={ref} className={className} style={style} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
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
