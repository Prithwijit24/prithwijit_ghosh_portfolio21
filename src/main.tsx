import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

type SpringAccent = 'blossom' | 'mint' | 'sunshine' | 'sky';

const NAV_SECTIONS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'foundation', label: 'Foundation', emoji: '📐' },
  { id: 'skills', label: 'Skills', emoji: '🧰' },
  { id: 'experience', label: 'Experience', emoji: '💼' },
  { id: 'chat', label: 'AI Chat', emoji: '✨' },
  { id: 'contact', label: 'Contact', emoji: '📬' }
] as const;

const NAV_CENTER_SECTIONS = NAV_SECTIONS.filter(
  (section) => section.id !== 'home' && section.id !== 'contact'
);

const PROFILE_LINKS = {
  email: 'ghoshprithwijit39@gmail.com',
  github: 'https://github.com/Prithwijit24',
  linkedin: 'https://www.linkedin.com/in/prithwijit-ghosh-datascience/'
} as const;

const SiteNav = () => {
  const [activeId, setActiveId] = useState<string>(NAV_SECTIONS[0].id);

  useEffect(() => {
    const sections = NAV_SECTIONS
      .map(({ id }) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-18% 0px -52% 0px', threshold: [0.12, 0.35, 0.6] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  };

  return (
    <header className="site-nav">
      <nav className="site-nav-inner" aria-label="Page sections">
        <div className="site-nav-left">
          <a
            href="#home"
            className="site-nav-brand"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
          >
            Portfolio
          </a>
        </div>

        <div className="site-nav-center">
          <ul className="site-nav-links">
            {NAV_CENTER_SECTIONS.map(({ id, label, emoji }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`site-nav-link${activeId === id ? ' site-nav-link--active' : ''}`}
                  aria-current={activeId === id ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(id);
                  }}
                >
                  <span className="site-nav-link-emoji" aria-hidden="true">{emoji}</span>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-nav-right">
          <a
            href="#contact"
            className={`site-nav-action${activeId === 'contact' ? ' site-nav-action--active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact');
            }}
          >
            Contact
          </a>
          <a
            href={PROFILE_LINKS.github}
            className="site-nav-action site-nav-action--icon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <GitHubIcon className="site-nav-action-icon" />
          </a>
          <a
            href={PROFILE_LINKS.linkedin}
            className="site-nav-action site-nav-action--icon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <LinkedInIcon className="site-nav-action-icon" />
          </a>
        </div>
      </nav>
    </header>
  );
};

const SPRING_PETALS = ['🌸', '🌼', '🦋', '🌷', '✨', '🍃', '🌺', '☀️'] as const;

const SpringPetals = () => (
  <div className="spring-petals" aria-hidden="true">
    {SPRING_PETALS.map((petal, index) => (
      <span
        key={petal}
        className="spring-petal"
        style={{
          left: `${8 + index * 11}%`,
          animationDelay: `${index * -1.7}s`,
          animationDuration: `${12 + index * 1.4}s`
        }}
      >
        {petal}
      </span>
    ))}
  </div>
);

const SectionHeading = ({ emoji, title }: { emoji: string; title: string }) => (
  <div className="section-heading">
    <span className="section-heading-icon" aria-hidden="true">{emoji}</span>
    <h3 className="text-3xl font-bold spring-gradient-text">{title}</h3>
  </div>
);

type FadeInProps = {
  children: ReactNode;
  delay?: number;
};

const FadeIn = ({ children, delay = 0 }: FadeInProps) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(entries[0].target);
      }
    }, { rootMargin: '0px 0px -100px 0px' });

    const node = domRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

type SkillDomain = {
  title: string;
  emoji: string;
  accent: SpringAccent;
  description: string;
  skills: string[];
};

const SKILL_DOMAINS: SkillDomain[] = [
  {
    title: 'Data Science',
    emoji: '🧠',
    accent: 'blossom',
    description: 'Building predictive models and intelligent systems from complex data.',
    skills: ['Python', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'NLP', 'Deep Learning', 'Feature Engineering', 'Model Evaluation', 'Statistics', 'Experiment Design']
  },
  {
    title: 'Data Analysis',
    emoji: '📊',
    accent: 'mint',
    description: 'Turning raw data into clear insights and evidence-backed decisions.',
    skills: ['SQL', 'Pandas', 'NumPy', 'EDA', 'Hypothesis Testing', 'A/B Testing', 'R', 'Data Wrangling', 'Time Series', 'Reporting']
  },
  {
    title: 'Dashboards & BI',
    emoji: '📈',
    accent: 'sunshine',
    description: 'Designing intuitive views that help teams monitor and act faster.',
    skills: ['Power BI', 'Tableau', 'Plotly', 'Matplotlib', 'Seaborn', 'KPI Design', 'Data Storytelling', 'Executive Summaries', 'Dash', 'Excel Analytics']
  },
  {
    title: 'Deployment & MLOps',
    emoji: '☁️',
    accent: 'sky',
    description: 'Shipping reliable pipelines and models into production environments.',
    skills: ['AWS', 'Apache Spark', 'Docker', 'CI/CD', 'ETL Pipelines', 'FastAPI', 'Model Monitoring', 'Git', 'Airflow', 'Cloud Storage']
  },
  {
    title: 'Engineering & Tools',
    emoji: '⚙️',
    accent: 'mint',
    description: 'Solid software practices that keep analytics work maintainable.',
    skills: ['Git', 'Linux', 'REST APIs', 'Jupyter', 'Agile Delivery', 'Code Review', 'Unit Testing', 'Documentation', 'VS Code', 'Jira']
  }
];

const SkillsSection = () => (
  <section id="skills" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
    <div className="max-w-6xl mx-auto skills-section">
      <FadeIn>
        <SectionHeading emoji="🧰" title="Skills & Domains" />
        <p className="text-spring-muted text-lg skills-intro icon-chip">
          <span aria-hidden="true">🌱</span>
          A cross-functional toolkit spanning modeling, analysis, visualization, and production delivery.
          <span aria-hidden="true"> ✨</span>
        </p>
      </FadeIn>

      <div className="skills-grid">
        {SKILL_DOMAINS.map((domain, index) => (
          <FadeIn key={domain.title} delay={index * 100}>
            <article className={`skill-domain-card skill-domain-card--${domain.accent}`}>
              <header className="skill-domain-header">
                <span className="skill-domain-icon" aria-hidden="true">{domain.emoji}</span>
                <div>
                  <h4 className="skill-domain-title">{domain.title}</h4>
                  <p className="skill-domain-description">{domain.description}</p>
                </div>
              </header>
              <ul className="skill-chip-list">
                {domain.skills.map((skill, skillIndex) => (
                  <li
                    key={skill}
                    className="skill-chip"
                    style={{ animationDelay: `${skillIndex * 45}ms` }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const DataNodesAnimation = () => (
  <div className="data-spring relative w-full h-48 border rounded-xl overflow-hidden flex items-center justify-center">
    <div className="absolute flex space-x-12">
      <div className="flex flex-col space-y-4">{['🌱', '🌿', '🍀'].map((icon, i) => <span key={`in-${i}`} className="text-2xl" aria-hidden="true">{icon}</span>)}</div>
      <div className="flex flex-col space-y-8 justify-center">{['📊', '✨'].map((icon, i) => <span key={`hid-${i}`} className="text-3xl" aria-hidden="true">{icon}</span>)}</div>
      <div className="flex flex-col justify-center"><span className="text-4xl" aria-hidden="true">🎯</span></div>
    </div>
  </div>
);

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

const LoaderIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HeroSignalPanel = () => (
  <div className="hero-panel">
    <div className="hero-panel-header">
      <span className="status-dot" />
      <span>🌱 Model pipeline in full bloom</span>
    </div>
    <div className="metric-grid">
      <div>
        <span className="metric-emoji" aria-hidden="true">📈</span>
        <strong>15%</strong>
        <span>Efficiency lift</span>
      </div>
      <div>
        <span className="metric-emoji" aria-hidden="true">🤖</span>
        <strong>3+</strong>
        <span>Years applied ML</span>
      </div>
      <div>
        <span className="metric-emoji" aria-hidden="true">🎓</span>
        <strong>IITK</strong>
        <span>Statistics foundation</span>
      </div>
      <div>
        <span className="metric-emoji" aria-hidden="true">☁️</span>
        <strong>AWS</strong>
        <span>Cloud ETL systems</span>
      </div>
    </div>
    <div className="calm-visual" aria-hidden="true">
      <div className="calm-chart">
        <span style={{ height: '42%' }} />
        <span style={{ height: '64%' }} />
        <span style={{ height: '52%' }} />
        <span style={{ height: '78%' }} />
        <span style={{ height: '68%' }} />
      </div>
      <div className="pie-chart">
        <span />
      </div>
      <div className="calm-summary">
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>
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

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResponse("As a Data Scientist from IIT Kanpur with 3 years at Accenture, I specialize in building ML pipelines (Spark/AWS) and NLP solutions. My focus is always on translating raw data into meaningful business decisions. How can I help you understand my experience further?");
    } catch {
      setError("My AI clone is currently sleeping.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-spring bg-slate-900 border border-teal-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(45,212,191,0.1)] relative overflow-hidden">
      <h4 className="text-2xl font-bold text-spring-ink mb-2 flex items-center gap-2">
        <span aria-hidden="true">🌸</span>
        <SparklesIcon className="text-teal-400 w-6 h-6" />
        Interview My AI Clone
        <span aria-hidden="true">✨</span>
      </h4>
      <p className="text-spring-muted text-sm mb-6">🦋 Ask my digital twin about my background — spring into the details!</p>
      <form onSubmit={handleSubmit} className="relative mb-6">
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="🌼 e.g., Have you worked with cloud ETL pipelines?"
          className="w-full bg-white border border-slate-700 rounded-lg py-4 pl-4 pr-16 text-spring-ink"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-500/10 text-teal-400 rounded-md" aria-label="Send message">
          {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SendIcon className="w-5 h-5" />}
        </button>
      </form>
      {(response || error) && (
        <div className="p-5 rounded-xl border border-slate-800 bg-white/90 text-spring-ink">
          <p className="text-sm">💬 {error || response}</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <div className="spring-page bg-slate-950 text-slate-200 font-sans">
      <SiteNav />
      <section id="home" className="hero-section h-screen px-6 scroll-section">
        <SpringPetals />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-a" aria-hidden="true" />
        <div className="hero-glow hero-glow-b" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-kicker icon-chip">🌷 Spring portfolio · Data science</div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 spring-gradient-text">
              Data Scientist.<br />
              <span className="hero-accent-line">Problem Solver.</span> 🌈
            </h1>
            <p className="text-lg md:text-xl text-spring-muted icon-chip">
              <span aria-hidden="true">🎓</span>
              M.Sc. Statistics @ IIT Kanpur
              <span aria-hidden="true"> · </span>
              <span aria-hidden="true">💼</span>
              3+ Years @ Accenture
            </p>
            <div className="hero-tags">
              <span className="tag-blossom icon-chip"><span aria-hidden="true">🤖</span> ML pipelines</span>
              <span className="tag-mint icon-chip"><span aria-hidden="true">💬</span> NLP systems</span>
              <span className="tag-sky icon-chip"><span aria-hidden="true">☁️</span> Cloud ETL</span>
            </div>
          </div>
          <HeroSignalPanel />
        </div>
      </section>

      <section id="foundation" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <SectionHeading emoji="📐" title="The Analytical Foundation" />
            <p className="text-spring-muted text-lg icon-chip">
              <span aria-hidden="true">🌱</span>
              <b>Data Scientist</b> at Accenture with 3+ years of experience and a Master’s from IIT Kanpur. Delivered analytics solutions to six+ global clients across sales, finance and operations. Built production-grade models for account receivable forecasting and late payment prediction, cash flow, and sales forecasting. Skilled at translating insights into executive-facing Excel and Power BI dashboards and communicating effectively with leadership. Collaborative team player with a strong focus on delivering high-quality client solutions.
              <span aria-hidden="true"> ✨</span>
            </p>
          </FadeIn>
          <DataNodesAnimation />
        </div>
      </section>

      <SkillsSection />

      <section id="experience" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
        <div className="max-w-4xl mx-auto">
          <SectionHeading emoji="💼" title="Professional Experience" />
          <div className="space-y-12">
            <FadeIn>
              <div className="experience-card">
                <h4 className="text-2xl font-bold text-spring-ink icon-chip">
                  <span aria-hidden="true">🌸</span>
                  Data Scientist @ Accenture
                </h4>
                <p className="text-spring-muted mt-4 icon-chip">
                  <span aria-hidden="true">🚀</span>
                  Architected scalable ETL pipelines and deployed ML models that improved operational efficiency by 15%.
                  <span aria-hidden="true"> 🎉</span>
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="chat" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
        <div className="max-w-4xl mx-auto">
          <AICloneChat />
        </div>
      </section>

      <section id="contact" className="contact-page-section px-6 bg-spring-section blend-section scroll-section">
        <div className="max-w-4xl mx-auto contact-section">
          <SectionHeading emoji="📬" title="Get in Touch" />
          <p className="text-spring-muted text-lg mb-8">
            Open to data science roles, collaborations, and interesting problems. Reach out anytime.
          </p>
          <div className="contact-links">
            <a href={PROFILE_LINKS.email} className="contact-card">
              <span aria-hidden="true">✉️</span>
              <span>Email me</span>
            </a>
            <a href={PROFILE_LINKS.github} className="contact-card" target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="contact-card-icon" />
              <span>GitHub</span>
            </a>
            <a href={PROFILE_LINKS.linkedin} className="contact-card" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="contact-card-icon" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

createRoot(rootElement).render(<App />);
