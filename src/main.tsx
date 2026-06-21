import { type FormEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

type SpringAccent = 'blossom' | 'mint' | 'sunshine' | 'sky';

const NAV_SECTIONS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'foundation', label: 'About', emoji: '📐' },
  { id: 'skills', label: 'Skills', emoji: '🧰' },
  { id: 'experience', label: 'Experience', emoji: '💼' },
  { id: 'projects', label: 'Projects', emoji: '🧪' },
  { id: 'education', label: 'Education', emoji: '🎓' },
  { id: 'chat', label: 'AI Chat', emoji: '✨' },
  { id: 'contact', label: 'Contact', emoji: '📬' }
] as const;

const NAV_CENTER_SECTIONS = NAV_SECTIONS.filter(
  (section) => section.id !== 'home' && section.id !== 'contact'
);

const PROFILE_LINKS = {
  email: 'mailto:ghoshprithwijit39@gmail.com',
  phone: 'tel:+917595986858',
  github: 'https://github.com/Prithwijit24',
  linkedin: 'https://www.linkedin.com/in/prithwijit-ghosh-datascience/',
  resume: new URL('./Prithwijit_Ghosh_Resume_20260523.pdf', import.meta.url).href
} as const;

const ROLES = [
  'Data Scientist',
  'Forecasting Engineer',
  'MLOps Specialist',
  'IIT Kanpur Alumnus'
];

const DS_ICONS = ['📊','📈','🔢','📉','🧮','💻','📀','🔬','🤖','📡','🧠','💾','🔣','📋','🗂️'];

/* ───────── Canvas data network ───────── */
const DataNetworkCanvas = () => {
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
const DataFloatIcons = () => {
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
  foundation: { bottomRight: '📐' },
  skills: { bottomLeft: '🔧', bottomRight: '⚡' },
  experience: { bottomLeft: '💼', bottomRight: '📋' },
  projects: { bottomLeft: '🧪', bottomRight: '🔬' },
  education: { bottomLeft: '🎓', bottomRight: '📜' },
  chat: { bottomRight: '🤖' },
  contact: { bottomLeft: '✉️', bottomRight: '📡' }
};

const SectionCorners = ({ section }: { section: string }) => {
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
const ScholarDecor = () => (
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
        <span key={i} className="scholar-ring-icon" style={{ '--i': i } as React.CSSProperties}>
          {['🎓','📚','📐','📊','🧮','📜','🔬','💡'][i]}
        </span>
      ))}
    </div>
  </div>
);

const CursorGlow = () => {
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

type TiltCardProps = { children: ReactNode; className?: string };

const TiltCard = ({ children, className = '' }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
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

const ScrollProgress = () => {
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

const BackToTop = () => {
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

const SiteNav = () => {
  const [activeId, setActiveId] = useState<string>(NAV_SECTIONS[0].id);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_SECTIONS.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-18% 0px -52% 0px', threshold: [0.12, 0.35, 0.6] }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu automatically if the viewport grows back past the breakpoint
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 860) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
    setIsMenuOpen(false);
  };

  return (
    <header className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <nav className="site-nav-inner" aria-label="Page sections">
        <div className="site-nav-left">
          <a href="#home" className="site-nav-brand" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            <span className="site-nav-brand-dot" aria-hidden="true" />PG
          </a>
        </div>
        <div className="site-nav-center">
          <ul className="site-nav-links">
            {NAV_CENTER_SECTIONS.map(({ id, label, emoji }) => (
              <li key={id}>
                <a href={`#${id}`}
                  className={`site-nav-link${activeId === id ? ' site-nav-link--active' : ''}`}
                  aria-current={activeId === id ? 'true' : undefined}
                  onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>
                  <span className="site-nav-link-emoji" aria-hidden="true">{emoji}</span>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-nav-right">
          <a href="#contact"
            className={`site-nav-action${activeId === 'contact' ? ' site-nav-action--active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
          <a href={PROFILE_LINKS.github} className="site-nav-action site-nav-action--icon" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <GitHubIcon className="site-nav-action-icon" />
          </a>
          <a href={PROFILE_LINKS.linkedin} className="site-nav-action site-nav-action--icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <LinkedInIcon className="site-nav-action-icon" />
          </a>
          <button
            type="button"
            className="site-nav-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="site-nav-mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <CloseIcon className="site-nav-toggle-icon" /> : <MenuIcon className="site-nav-toggle-icon" />}
          </button>
        </div>
      </nav>

      <div id="site-nav-mobile-menu" className={`site-nav-mobile-menu${isMenuOpen ? ' site-nav-mobile-menu--open' : ''}`}>
        <ul className="site-nav-mobile-links">
          {NAV_SECTIONS.map(({ id, label, emoji }) => (
            <li key={id}>
              <a href={`#${id}`}
                className={`site-nav-link${activeId === id ? ' site-nav-link--active' : ''}`}
                aria-current={activeId === id ? 'true' : undefined}
                onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>
                <span className="site-nav-link-emoji" aria-hidden="true">{emoji}</span>
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="site-nav-mobile-social">
          <a href={PROFILE_LINKS.resume} target="_blank" rel="noopener noreferrer" className="site-nav-action">
            <DownloadIcon className="site-nav-action-icon" />
            <span>Resume</span>
          </a>
          <a href={PROFILE_LINKS.github} className="site-nav-action site-nav-action--icon" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <GitHubIcon className="site-nav-action-icon" />
          </a>
          <a href={PROFILE_LINKS.linkedin} className="site-nav-action site-nav-action--icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <LinkedInIcon className="site-nav-action-icon" />
          </a>
        </div>
      </div>
    </header>
  );
};

/* ───────── Typewriter ───────── */
const useTypewriter = () => {
  const [text, setText] = useState('');
  const stateRef = useRef({ roleIndex: 0, charIndex: 0, isDeleting: false });
  useEffect(() => {
    const state = stateRef.current;
    const currentRole = ROLES[state.roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!state.isDeleting && state.charIndex < currentRole.length) {
      timeout = setTimeout(() => { state.charIndex += 1; setText(currentRole.slice(0, state.charIndex)); }, 80);
    } else if (!state.isDeleting && state.charIndex === currentRole.length) {
      timeout = setTimeout(() => { state.isDeleting = true; }, 2000);
    } else if (state.isDeleting && state.charIndex > 0) {
      timeout = setTimeout(() => { state.charIndex -= 1; setText(currentRole.slice(0, state.charIndex)); }, 40);
    } else if (state.isDeleting && state.charIndex === 0) {
      state.isDeleting = false;
      state.roleIndex = (state.roleIndex + 1) % ROLES.length;
    }
    return () => clearTimeout(timeout);
  }, [text]);
  return text;
};

const TypewriterText = () => {
  const text = useTypewriter();
  return (
    <span className="typewriter-text">
      {text}<span className="typewriter-cursor" aria-hidden="true">|</span>
    </span>
  );
};

/* ───────── Section heading ───────── */
const SectionHeading = ({ emoji, title }: { emoji: string; title: string }) => (
  <div className="section-heading">
    <span className="section-heading-icon" aria-hidden="true">{emoji}</span>
    <h3 className="text-3xl font-bold spring-gradient-text">{title}</h3>
  </div>
);

type FadeInProps = { children: ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'scale' };

const FadeIn = ({ children, delay = 0, direction = 'up' }: FadeInProps) => {
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

const AnimatedCounter = ({ target, suffix = '', prefix = '', duration = 2000 }: AnimatedCounterProps) => {
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

/* ───────── Data types ───────── */
type SkillDomain = { title: string; emoji: string; accent: SpringAccent; description: string; skills: string[]; level: number };
type ExperienceItem = { title: string; client: string; timeline: string; summary: string; bullets: string[]; tags: string[] };
type ProjectItem = { title: string; timeline?: string; summary: string; bullets: string[]; link?: string; tags: string[] };

const SKILL_DOMAINS: SkillDomain[] = [
  { title: 'Data Science', emoji: '🧠', accent: 'blossom', description: 'Predictive models & intelligent systems from complex data.', skills: ['Python','Scikit-learn','XGBoost','LightGBM','CatBoost','TensorFlow','Keras'], level: 95 },
  { title: 'Data Analysis', emoji: '📊', accent: 'mint', description: 'Turning raw data into clear insights & evidence-backed decisions.', skills: ['SQL','Pandas','NumPy','R','EDA','Statistics','Time Series'], level: 92 },
  { title: 'Dashboards & BI', emoji: '📈', accent: 'sunshine', description: 'Intuitive views that help teams monitor and act faster.', skills: ['Power BI','Tableau','Plotly','Matplotlib','Seaborn','KPI Design','Excel Analytics'], level: 88 },
  { title: 'Deployment & MLOps', emoji: '☁️', accent: 'sky', description: 'Shipping reliable pipelines & models into production.', skills: ['AWS Fargate','AWS EMR','S3','Docker','Kubernetes','GitHub Actions','Airflow'], level: 85 },
  { title: 'AI Agents & Systems', emoji: '⚙️', accent: 'mint', description: 'AI-enabled apps and production services around models.', skills: ['LangChain','LangGraph','Ollama','RAG','AI Agents','Streamlit','FastAPI'], level: 82 }
];

const EXPERIENCE_ITEMS: ExperienceItem[] = [
  { title: 'Data Scientist Specialist', client: 'Accenture · Global QSR Brand', timeline: 'Jul 2023 – Present',
    summary: 'Multi-country sales & guest-count forecasting system for long-range planning.',
    bullets: [
      'Built ensemble forecasts up to 48 months ahead using Prophet, Theta, MSTL, LightGBM across 6 countries and macroeconomic indicators.',
      'Created a horizon-aware evaluation framework across 450+ models; reached 97–99% accuracy for 24-month forecasts.',
      'Shipped Docker + GitHub Actions MLOps pipeline with SonarQube, Snyk, JFrog, Airflow, Astronomer, and AWS Fargate.'
    ], tags: ['Time Series','MLOps','AWS Fargate','Airflow','LightGBM'] },
  { title: 'Data Scientist Specialist', client: 'Accenture · Water Treatment Brand', timeline: 'Jul 2023 – Present',
    summary: 'Customer-level late-payment prediction, calibrated risk scoring & AR forecasting.',
    bullets: [
      'Selected 50 features from 1000+ derived features; XGBoost models for 10K+ monthly customer base with 90% AUC due-month.',
      'Reduced overdue amount by 38%, lowered AR by 15%, increased collections by 12% post go-live.',
      'Power BI dashboards delivering 95–98% accuracy across Not Yet Due, Current Due, and Over Due categories.'
    ], tags: ['XGBoost','Risk Scoring','Power BI','AR Forecasting','Collections'] },
  { title: 'Data Science POCs', client: 'Power Utility & Liquor Brand Clients', timeline: 'Accenture',
    summary: 'Forecasting & marketing analytics prototypes for cash-flow accuracy and customer growth.',
    bullets: [
      'B2C cash-flow forecasting over 6M+ records: Cash-In accuracy 98% (from 70%), Cash-Out 93% (from 64%).',
      'Subscription behavior, campaigns, funnels, up-sell, cross-sell, churn propensity, and RFM segmentation.'
    ], tags: ['Cash Flow','RFM','Marketing Analytics','Dashboards'] }
];

const PROJECTS: ProjectItem[] = [
  { title: 'Demographic-Aware Recommender', timeline: 'Jun 2025 – Mar 2026',
    summary: 'Facial-embedding recommendation engine with demographic prediction & bias-aware LangChain agent.',
    bullets: ['Predicted age, gender, race with 97% accuracy using facial embeddings.','Containerized Streamlit app on Hugging Face.'],
    tags: ['FaceNet','LangChain','Streamlit','Hugging Face'] },
  { title: 'Real-Time Fraud Detection', timeline: 'Jan 2026 – Mar 2026',
    summary: 'Scalable transaction monitoring for low-latency fraud inference and explainable risk scores.',
    bullets: ['Streaming ML inference & explainable scoring.','Production deployment with Docker, Kubernetes, FastAPI.'],
    tags: ['Fraud Detection','FastAPI','Kubernetes','Streaming ML'] },
  { title: 'Age, Race & Gender Detection',
    summary: 'UTKFace preprocessing and facial embeddings project.',
    bullets: ['23K UTKFace images with augmentation; FaceNet → 512-dim embeddings.','98% SVM gender, 94% KNN race, 5.8 age MAPE with LGBM.','End-to-end Streamlit app deployed.'],
    link: 'https://github.com/Prithwijit24/age-identification',
    tags: ['Computer Vision','FaceNet','SVM','LGBM'] }
];

const ACHIEVEMENTS_DATA = [
  { emoji: '🏆', stat: 'AIR 7', label: 'JAM Statistics All India Rank', desc: 'Among thousands of candidates nationwide' },
  { emoji: '📊', stat: '38%', label: 'Overdue Reduction', desc: 'ML-driven collections strategy' },
  { emoji: '🎯', stat: '97–99%', label: 'Forecast Accuracy', desc: '24-month multi-country forecasts' },
  { emoji: '☁️', stat: '98%', label: 'Cash-In Accuracy', desc: '6M+ customer cash-flow records' },
  { emoji: '📈', stat: '450+', label: 'Models Evaluated', desc: 'Horizon-aware selection framework' },
  { emoji: '🔬', stat: '90%', label: 'Due-Month AUC', desc: 'Late-payment risk prediction' }
];

type SkillBarProps = { level: number; accent: SpringAccent };

const SkillBar = ({ level, accent }: SkillBarProps) => {
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

/* ───────── Section components ───────── */

const SkillsSection = () => (
  <section id="skills" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
    <div className="max-w-5xl mx-auto">
      <FadeIn><SectionHeading emoji="🧰" title="Skills & Expertise" /></FadeIn>
      <div className="skills-grid">
        {SKILL_DOMAINS.map((domain, index) => (
          <FadeIn key={domain.title} delay={index * 90}>
            <TiltCard className={`skill-card skill-card--${domain.accent}`}>
              <div className="skill-card-header">
                <span className="skill-card-icon" aria-hidden="true">{domain.emoji}</span>
                <h4 className="skill-card-title">{domain.title}</h4>
              </div>
              <p className="skill-card-desc">{domain.description}</p>
              <SkillBar level={domain.level} accent={domain.accent} />
              <ul className="skill-pill-list">
                {domain.skills.map(skill => (
                  <li key={skill} className={`skill-pill skill-pill--${domain.accent}`}>{skill}</li>
                ))}
              </ul>
            </TiltCard>
          </FadeIn>
        ))}
      </div>
    </div>
    <SectionCorners section="skills" />
  </section>
);

const ExperienceSection = () => (
  <section id="experience" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
    <div className="max-w-6xl mx-auto">
      <FadeIn><SectionHeading emoji="💼" title="Professional Experience" /></FadeIn>
      <div className="experience-list">
        {EXPERIENCE_ITEMS.map((item, index) => (
          <FadeIn key={`${item.client}-${item.summary}`} delay={index * 100} direction="left">
            <div className="experience-row">
              <div className="timeline-node" aria-hidden="true">
                <div className="timeline-dot" style={{ animationDelay: `${index * 0.3}s` }} />
                {index < EXPERIENCE_ITEMS.length - 1 && <div className="timeline-line" />}
              </div>
              <TiltCard className="experience-card">
                <h3 className="experience-role-heading">{item.title}</h3>
                <div className="experience-meta-row">
                  <span className="experience-company">{item.client}</span>
                  <span className="experience-meta-sep" aria-hidden="true">·</span>
                  <span className="experience-eyebrow experience-eyebrow--inline">{item.timeline}</span>
                </div>
                <p className="experience-summary">{item.summary}</p>
                <ul className="detail-list">
                  {item.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
                <div className="compact-tags">
                  {item.tags.map(t => <span key={t}>{t}</span>)}
                </div>
              </TiltCard>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
    <SectionCorners section="experience" />
  </section>
);

const ProjectsSection = () => (
  <section id="projects" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
    <div className="max-w-6xl mx-auto">
      <FadeIn><SectionHeading emoji="🧪" title="Portfolio Projects" /></FadeIn>
      <div className="project-grid">
        {PROJECTS.slice(0, 3).map((project, index) => (
          <FadeIn key={project.title} delay={index * 80}>
            <TiltCard className="project-card">
              {project.timeline && <p className="experience-eyebrow">{project.timeline}</p>}
              <h3 className="project-card-heading">{project.title}</h3>
              <p>{project.summary}</p>
              <ul className="detail-list">
                {project.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
              <div className="compact-tags">
                {project.tags.map(t => <span key={t}>{t}</span>)}
              </div>
              {project.link && <a className="text-link" href={project.link} target="_blank" rel="noopener noreferrer">View repository</a>}
            </TiltCard>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={280}>
        <div className="projects-see-more">
          <span className="projects-ellipsis" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
          <a className="projects-github-link" href={PROFILE_LINKS.github} target="_blank" rel="noopener noreferrer">
            <svg className="projects-github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
            </svg>
            See more on GitHub
          </a>
        </div>
      </FadeIn>
    </div>
    <SectionCorners section="projects" />
  </section>
);

const EducationSection = () => (
  <section id="education" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section edu-section">
    <div className="max-w-5xl mx-auto">
      <FadeIn><SectionHeading emoji="🎓" title="Education" /></FadeIn>
      <div className="education-grid">
        <FadeIn>
          <TiltCard className="education-card education-card--primary">
            <div className="edu-card-top">
              <div className="edu-icon-ring" aria-hidden="true">🎓</div>
              <div>
                <p className="experience-eyebrow">Aug 2021 – Jul 2023</p>
                <h4>M.Sc. in Statistics</h4>
                <p className="edu-institute">Indian Institute of Technology Kanpur</p>
              </div>
            </div>
            <div className="edu-stats">
              <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={89} prefix="" suffix="" duration={1500} /></span><span className="edu-stat-dot">.</span><span className="edu-stat-num">9</span><span className="edu-stat-label">CGPA</span></div>
              <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={7} duration={1500} /></span><span className="edu-stat-label">JAM AIR</span></div>
              <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={6} duration={1500} /></span><span className="edu-stat-label">Dept. Rank</span></div>
            </div>
          </TiltCard>
        </FadeIn>
        <FadeIn delay={100}>
          <TiltCard className="education-card education-card--secondary">
            <div className="edu-card-top">
              <div className="edu-icon-ring" aria-hidden="true">📚</div>
              <div>
                <p className="experience-eyebrow">Jun 2018 – Jul 2021</p>
                <h4>B.Sc. in Statistics</h4>
                <p className="edu-institute">Bidhannagar College</p>
              </div>
            </div>
            <div className="edu-stats">
              <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={999} prefix="" suffix="" duration={1500} /></span><span className="edu-stat-dot">.</span><span className="edu-stat-num">99</span><span className="edu-stat-label">CGPA</span></div>
              <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={1} duration={1500} /></span><span className="edu-stat-label">Dept. Rank</span></div>
            </div>
          </TiltCard>
        </FadeIn>
      </div>
    </div>
    <ScholarDecor />
    <SectionCorners section="education" />
  </section>
);

const HeroSignalPanel = () => (
  <div className="hero-panel">
    <div className="hero-panel-header">
      <span className="status-dot" />
      <span>📊 Live metrics · Production analytics</span>
    </div>
    <div className="metric-grid">
      <div><span className="metric-emoji" aria-hidden="true">📈</span><strong><AnimatedCounter target={99} suffix="%" />-<AnimatedCounter target={97} suffix="%" /></strong><span>24-month forecast accuracy</span></div>
      <div><span className="metric-emoji" aria-hidden="true">🤖</span><strong><AnimatedCounter target={450} suffix="+" /></strong><span>Forecasting models evaluated</span></div>
      <div><span className="metric-emoji" aria-hidden="true">🎓</span><strong><AnimatedCounter target={90} suffix="%" /></strong><span>Due-month AUC</span></div>
      <div><span className="metric-emoji" aria-hidden="true">☁️</span><strong><AnimatedCounter target={6} suffix="M+" /></strong><span>Cash-flow records</span></div>
    </div>
    <div className="calm-visual" aria-hidden="true">
      <div className="calm-chart">
        <span style={{ height: '42%' }} /><span style={{ height: '64%' }} /><span style={{ height: '52%' }} /><span style={{ height: '78%' }} /><span style={{ height: '68%' }} />
      </div>
      <div className="pie-chart"><span /></div>
      <div className="calm-summary">
        <span /><span /><span />
      </div>
    </div>
  </div>
);

/* ───────── Achievements redesigned ───────── */
const AchievementsSection = () => (
  <section className="achievements-section py-24 px-6 bg-spring-section blend-section">
    <div className="max-w-6xl mx-auto">
      <FadeIn><SectionHeading emoji="🏆" title="Key Achievements" /></FadeIn>
      <div className="achievement-grid">
        {ACHIEVEMENTS_DATA.map((a, i) => (
          <FadeIn key={a.label} delay={i * 70} direction="scale">
            <TiltCard className="achievement-card">
              <span className="achievement-card-emoji" aria-hidden="true">{a.emoji}</span>
              <div className="achievement-card-body">
                <strong className="achievement-card-stat">{a.stat}</strong>
                <span className="achievement-card-label">{a.label}</span>
                <span className="achievement-card-desc">{a.desc}</span>
              </div>
            </TiltCard>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const DataNodesAnimation = () => (
  <div className="data-spring relative w-full h-56 rounded-xl overflow-hidden flex items-center justify-center">
    <div className="data-flow-nodes" aria-hidden="true">
      {['🌱','📊','⚡','🧠','🎯','💡','🔬','📈'].map((ic, i) => (
        <span key={ic} className={`data-node data-node--${i + 1}`}>{ic}</span>
      ))}
    </div>
    <div className="data-flow-connections" aria-hidden="true">
      <svg viewBox="0 0 300 200" className="data-flow-svg">
        <path d="M30 100 Q 80 30, 150 80 T 270 100" fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth="2" className="data-flow-path" />
        <path d="M30 140 Q 100 180, 150 120 T 270 140" fill="none" stroke="rgba(251,113,133,0.25)" strokeWidth="2" className="data-flow-path" />
        <path d="M30 60 Q 100 20, 150 100 T 270 60" fill="none" stroke="rgba(250,204,21,0.25)" strokeWidth="2" className="data-flow-path" />
        <circle r="4" fill="rgba(52,211,153,0.6)" className="data-flow-dot" style={{ offsetPath: "path('M30 100 Q 80 30, 150 80 T 270 100')" }} />
        <circle r="4" fill="rgba(251,113,133,0.6)" className="data-flow-dot" style={{ offsetPath: "path('M30 140 Q 100 180, 150 120 T 270 140')", animationDelay: '-2s' }} />
        <circle r="4" fill="rgba(250,204,21,0.6)" className="data-flow-dot" style={{ offsetPath: "path('M30 60 Q 100 20, 150 100 T 270 60')", animationDelay: '-4s' }} />
      </svg>
    </div>
  </div>
);

/* ───────── Icons ───────── */
const SparklesIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 14l.6 1.6L7 16l-1.4.4L5 18l-.6-1.6L3 16l1.4-.4L5 14z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SendIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22 2 11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m22 2-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GitHubIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.12-1.48-1.12-1.48-.92-.64.07-.63.07-.63 1.02.07 1.55 1.07 1.55 1.07.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.74 0 0 .84-.27 2.75 1.03A9.2 9.2 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.42.2 2.48.1 2.74.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
  </svg>
);
const LinkedInIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.55V9h3.57v11.45Z" />
  </svg>
);
const DownloadIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const MenuIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const CloseIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const QuoteIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
  </svg>
);
const LoaderIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AICloneChat = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true); setError(''); setResponse('');
    try { await new Promise(r => setTimeout(r, 1500)); setResponse("As a Data Scientist from IIT Kanpur with 3 years at Accenture, I specialize in building ML pipelines (Spark/AWS) and NLP solutions. My focus is always on translating raw data into meaningful business decisions. How can I help you understand my experience further?"); }
    catch { setError("My AI clone is currently sleeping."); }
    finally { setIsLoading(false); }
  };
  return (
    <div className="chat-spring rounded-2xl p-8 relative overflow-hidden">
      <h4 className="text-2xl font-bold text-spring-ink mb-2 flex items-center gap-2">
        <SparklesIcon className="text-teal-400 w-6 h-6" />
        Interview My AI Clone
      </h4>
      <p className="text-spring-muted text-sm mb-2">🧠 Ask my digital twin about my background.</p>
      <p className="chat-demo-note">✨ Demo preview — replies are scripted for now, not a live AI connection.</p>
      <form onSubmit={handleSubmit} className="relative mb-6">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="💡 e.g., Have you worked with cloud ETL pipelines?"
          className="w-full bg-white/80 border border-slate-300 rounded-lg py-4 pl-4 pr-16 text-spring-ink" />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-500/10 text-teal-400 rounded-md hover:bg-teal-500/20 transition-colors" aria-label="Send message">
          {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SendIcon className="w-5 h-5" />}
        </button>
      </form>
      {(response || error) && (
        <div className="chat-response p-5 rounded-xl border border-slate-200 bg-white/90 text-spring-ink">
          <p className="text-sm">💬 {error || response}</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <div className="spring-page font-sans">
      <CursorGlow />
      <ScrollProgress />
      <SiteNav />

      {/* ───── HERO ───── */}
      <section id="home" className="hero-section h-screen px-6 scroll-section">
        <DataNetworkCanvas />
        <DataFloatIcons />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-a" aria-hidden="true" />
        <div className="hero-glow hero-glow-b" aria-hidden="true" />
        <div className="hero-glow hero-glow-c" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-kicker icon-chip">🚀 DATA SCIENCE · FORECASTING · MLOPS</div>
            <h1 className="hero-title spring-gradient-text">
              Hi, I&apos;m<br />
              <span className="hero-accent-line">Prithwijit Ghosh.</span>
            </h1>
            <div className="hero-role-line"><TypewriterText /></div>
            <p className="hero-location icon-chip">
              <span aria-hidden="true">🎓</span> M.Sc. Statistics @ IIT Kanpur
              <span aria-hidden="true"> · </span>
              <span aria-hidden="true">💼</span> Data Scientist @ Accenture
            </p>
            <div className="hero-tags">
              <span className="tag-blossom icon-chip" aria-label="Forecasting models">🤖 Forecasting</span>
              <span className="tag-mint icon-chip" aria-label="Risk scoring">💬 Risk scoring</span>
              <span className="tag-sky icon-chip" aria-label="MLOps on AWS">☁️ MLOps</span>
              <a className="hero-resume-link" href={PROFILE_LINKS.resume} target="_blank" rel="noopener noreferrer">
                <svg className="hero-resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Resume
              </a>
            </div>
          </div>
          <HeroSignalPanel />
        </div>
      </section>

      {/* ───── ABOUT ───── */}
      <section id="foundation" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="about-section-text">
              <SectionHeading emoji="📐" title="About Me" />
              <p className="text-spring-muted text-lg leading-relaxed">
                <b>Data Scientist Specialist</b> at Accenture with 2.9+ years of experience and an IIT Kanpur Master&apos;s in Statistics. I build and deploy forecasting, risk, and analytics systems across finance, payments-adjacent, sales, and operations domains.
              </p>
              <p className="text-spring-muted text-lg mt-4 leading-relaxed">
                My work spans sales and guest-count forecasting, accounts receivable forecasting, late-payment prediction, cash-flow forecasting, marketing analytics, Power BI dashboards, and production MLOps with Docker, GitHub Actions, Airflow, Astronomer, and AWS Fargate.
              </p>
              <p className="text-spring-muted text-lg mt-4 leading-relaxed">
                💡 When I&apos;m not wrangling data pipelines, you&apos;ll find me exploring AI agents, contributing to open-source ML projects, or diving into the latest in MLOps and LLM research.
              </p>
              <div className="about-quote">
                <QuoteIcon className="about-quote-icon" />
                <blockquote>Data is the new soil — with the right statistical tools and engineering, we grow decisions that matter.</blockquote>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="mt-12">
              <DataNodesAnimation />
            </div>
          </FadeIn>
        </div>
        <SectionCorners section="foundation" />
      </section>

      {/* ───── ACHIEVEMENTS ───── */}
      <AchievementsSection />

      {/* ───── SKILLS ───── */}
      <SkillsSection />

      {/* ───── EXPERIENCE ───── */}
      <ExperienceSection />
      <ProjectsSection />
      <EducationSection />

      {/* ───── CHAT ───── */}
      <section id="chat" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
        <div className="max-w-4xl mx-auto">
          <FadeIn><SectionHeading emoji="✨" title="Interview My AI Clone" /></FadeIn>
          <AICloneChat />
        </div>
        <SectionCorners section="chat" />
      </section>

      {/* ───── CONTACT ───── */}
      <section id="contact" className="contact-page-section px-6 bg-spring-section blend-section scroll-section">
        <div className="max-w-4xl mx-auto contact-section">
          <FadeIn><SectionHeading emoji="📬" title="Get in Touch" /></FadeIn>
          <FadeIn delay={100}>
            <p className="text-spring-muted text-lg mb-8">
              Open to data science roles, collaborations, forecasting systems, MLOps work, and interesting analytics problems. Let&apos;s build something impactful together.
            </p>
          </FadeIn>
          <div className="contact-links">
            <a href={PROFILE_LINKS.email} className="contact-card"><span aria-hidden="true">✉️</span><span>Email me</span></a>
            <a href={PROFILE_LINKS.phone} className="contact-card"><span aria-hidden="true">📞</span><span>Call me</span></a>
            <a href={PROFILE_LINKS.github} className="contact-card" target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="contact-card-icon" /><span>GitHub</span>
            </a>
            <a href={PROFILE_LINKS.linkedin} className="contact-card" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="contact-card-icon" /><span>LinkedIn</span>
            </a>
            <a href={PROFILE_LINKS.resume} className="contact-card" target="_blank" rel="noopener noreferrer">
              <span aria-hidden="true">📄</span><span>Resume</span>
            </a>
          </div>
        </div>
        <SectionCorners section="contact" />
      </section>
      <BackToTop />
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root was not found.');
createRoot(rootElement).render(<App />);
