import { type FormEvent, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

import {
  PROFILE_LINKS,
  SKILL_DOMAINS, EXPERIENCE_ITEMS, PROJECTS, ACHIEVEMENTS_DATA
} from './data';
import { useTypewriter } from './hooks/useTypewriter';
import {
  FadeIn, SectionHeading, AnimatedCounter, TiltCard, SkillBar
} from './components/primitives';
import {
  CursorGlow, ScrollProgress, BackToTop, DataNetworkCanvas, DataFloatIcons,
  SectionCorners, ScholarDecor
} from './components/decorations';
import { SiteNav } from './components/SiteNav';
import {
  SparklesIcon, SendIcon, LoaderIcon, QuoteIcon, GitHubIcon, LinkedInIcon
} from './components/Icons';

/* ───────── Typewriter ───────── */
const TypewriterText = () => {
  const text = useTypewriter();
  return (
    <span className="typewriter-text">
      {text}<span className="typewriter-cursor" aria-hidden="true">|</span>
    </span>
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
