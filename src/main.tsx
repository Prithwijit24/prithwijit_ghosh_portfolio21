import { createRoot } from 'react-dom/client';
import type { SyntheticEvent } from 'react';
import './style.css';

import {
  PROFILE_LINKS, SKILL_DOMAINS, EXPERIENCE_ITEMS, PROJECTS, ACHIEVEMENTS_DATA, CERTIFICATIONS, BADGES, MSC_PROJECT, HOBBIES, tagAccent
} from './data';
import {
  FadeIn, SectionHeading, AnimatedCounter, TiltCard, SkillBar
} from './components/primitives';
import {
  CursorGlow, ScrollProgress, BackToTop, SectionCorners
} from './components/decorations';
import { SiteNav } from './components/SiteNav';
import { SceneFx } from './components/SceneFx';
import { ExperienceViz } from './components/ExperienceViz';
import { HyperCubeViz, DDPlotViz } from './components/MscViz';
import { ProjectArch, type ArchKind } from './components/ProjectArch';
import { Hero } from './sections/Hero';
import {
  GitHubIcon, LinkedInIcon, GmailIcon, DownloadIcon
} from './components/Icons';

/* per-project architecture diagrams, in PROJECTS order */
const PROJECT_ARCH: ArchKind[] = ['recommender', 'fraud', 'travel', 'music'];

/* Decorative gold medal frame: sunburst rays + gold bezel + beaded ring. */
const MedalFrame = () => {
  const rays = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15) * Math.PI / 180;
    const x1 = 60 + 45 * Math.cos(a), y1 = 60 + 45 * Math.sin(a);
    const x2 = 60 + 57 * Math.cos(a), y2 = 60 + 57 * Math.sin(a);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 2 ? '#f0c24f' : '#c8881a'} strokeWidth="3.6" strokeLinecap="round" />;
  });
  return (
    <svg className="badge-frame" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="medalGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde6a8" />
          <stop offset="0.5" stopColor="#eda82a" />
          <stop offset="1" stopColor="#a8620d" />
        </linearGradient>
      </defs>
      <g>{rays}</g>
      <circle cx="60" cy="60" r="51" fill="none" stroke="#8a4e0a" strokeWidth="1.4" />
      <circle cx="60" cy="60" r="48" fill="none" stroke="url(#medalGold)" strokeWidth="6" />
      <circle cx="60" cy="60" r="48" fill="none" stroke="#fff7e0" strokeWidth="2" strokeDasharray="0.5 7.3" strokeLinecap="round" opacity="0.92" />
      <circle cx="60" cy="60" r="45.2" fill="none" stroke="#7a440a" strokeWidth="1.1" />
      <circle cx="60" cy="60" r="44.7" fill="#fffaf0" />
    </svg>
  );
};

/* Custom circular badge art — gradient fill + centered text lines. */
const BADGE_ART: Record<string, { colorA: string; colorB: string; accent: string; lines: string[] }> = {
  '/badges/applied-ds-python.png': { colorA: '#4589ff', colorB: '#001141', accent: '#ffd700', lines: ['Applied', 'Data Science', 'Python · L2'] },
  '/badges/data-analysis-python.png': { colorA: '#24a148', colorB: '#022d0d', accent: '#ffd700', lines: ['Data Analysis', 'Using Python'] },
};

const BadgeArt = ({ img }: { img: string }) => {
  const cfg = BADGE_ART[img];
  if (!cfg) return <img className="badge-img" src={img} alt="" loading="lazy" />;
  const { colorA, colorB, accent, lines } = cfg;
  const lh = 11;
  const startY = 50 - ((lines.length - 1) * lh) / 2;
  const uid = img.replace(/\W/g, '');
  return (
    <svg className="badge-img" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id={`bdg${uid}`} cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor={colorA} />
          <stop offset="1" stopColor={colorB} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#bdg${uid})`} />
      <circle cx="50" cy="50" r="43" fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.45" />
      <circle cx="50" cy="50" r="35" fill="none" stroke={accent} strokeWidth="0.8" strokeOpacity="0.2" />
      {lines.map((line, i) => (
        <text key={i} x="50" y={startY + i * lh} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui,-apple-system,sans-serif">
          {line}
        </text>
      ))}
    </svg>
  );
};

/* Render a collage tile's media: looping muted video for clips, image otherwise. */
const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);
const TileMedia = ({ src, alt, className }: { src: string; alt: string; className?: string }) =>
  isVideo(src)
    ? <video className={className} src={src} autoPlay loop muted playsInline />
    : <img className={className} src={src} alt={alt} loading="lazy" onError={hideBrokenLogo} />;

/* If a college logo file is missing, hide the broken image and show the emoji fallback. */
const hideBrokenLogo = (e: SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  img.style.display = 'none';
  const fallback = img.nextElementSibling as HTMLElement | null;
  if (fallback) fallback.style.display = 'flex';
};

/* ───────── Section components ───────── */

const SkillsSection = () => (
  <section id="skills" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
    <SceneFx variant="flow" accent={[16, 185, 129]} />
    <div className="mx-auto" style={{ width: 'min(84rem,100%)' }}>
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
    <div className="mx-auto" style={{ width: 'min(84rem,100%)' }}>
      <FadeIn><SectionHeading emoji="💼" title="Professional Experience" /></FadeIn>
      <div className="experience-layout">
        <FadeIn delay={80} direction="left">
          <div className="experience-rail" aria-hidden="true"><ExperienceViz /></div>
        </FadeIn>
        <div className="experience-list">
          {EXPERIENCE_ITEMS.map((item, index) => (
            <FadeIn key={`${item.client}-${item.summary}`} delay={index * 100} direction="left">
              <TiltCard className="experience-card">
                <h3 className="experience-role-heading">{item.title}</h3>
                <div className="experience-meta-row">
                  <span className="experience-company">{item.client}</span>
                  <span className="experience-meta-sep" aria-hidden="true">·</span>
                  <span className="experience-eyebrow experience-eyebrow--inline">{item.timeline}</span>
                </div>
                <ul className="detail-list">
                  {item.bullets.map(b => <li key={b}>{renderRich(b)}</li>)}
                </ul>
                <div className="compact-tags">
                  {item.tags.map((t) => <span key={t} className={`tag-chip skill-pill--${tagAccent(t)}`}>{t}</span>)}
                </div>
              </TiltCard>
            </FadeIn>
          ))}
          <FadeIn delay={EXPERIENCE_ITEMS.length * 100} direction="left">
            <div className="experience-poc-card">
              <span className="experience-poc-icon" aria-hidden="true">🧪</span>
              <p>
                … also POC &amp; experimental projects on <strong>Anomaly Detection</strong>, <strong>Marketing Campaign</strong> analytics, <strong>Upsell</strong> &amp; <strong>Cross-sell</strong>, <strong>Recency–Frequency–Monetary (RFM)</strong> analysis, <strong>Subscription pattern</strong> analysis, <strong>Clickstream</strong> analysis and so on.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
    <SectionCorners section="experience" />
  </section>
);

/* Render **bold** and *italic* markers in MSc copy as emphasis. */
const renderRich = (text: string) =>
  text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });

const MscProjectSection = () => (
  <section id="research" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
    <div className="mx-auto" style={{ width: 'min(72rem,100%)' }}>
      <FadeIn><SectionHeading emoji="🔬" title="Master's Research" /></FadeIn>
      <FadeIn delay={80}>
        <p className="experience-eyebrow msc-eyebrow">{MSC_PROJECT.eyebrow}</p>
        <h3 className="msc-title">{MSC_PROJECT.title}</h3>
        <p className="msc-summary">{renderRich(MSC_PROJECT.summary)}</p>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="msc-intro">
          <span className="msc-block-label">The problem</span>
          <p>{renderRich(MSC_PROJECT.problem)}</p>
        </div>
      </FadeIn>

      <div className="msc-compare">
        <FadeIn direction="left">
          <figure className="msc-panel">
            <HyperCubeViz />
            <figcaption><b>Original ℝᵈ space</b><br />high-dimensional · <span className="msc-bad-key">non-separable</span></figcaption>
          </figure>
        </FadeIn>
        <div className="msc-arrow" aria-hidden="true">
          <span className="msc-arrow-glyph">→</span>
          <span className="msc-arrow-lbl">robust DD<br />transform</span>
        </div>
        <FadeIn direction="right">
          <figure className="msc-panel msc-panel--good">
            <DDPlotViz />
            <figcaption><b>Robust DD space</b><br />classes cleanly <span className="msc-good-key">separable</span></figcaption>
          </figure>
        </FadeIn>
      </div>

      <FadeIn delay={100}>
        <div className="msc-intro">
          <span className="msc-block-label">The approach</span>
          <p>{renderRich(MSC_PROJECT.approach)}</p>
        </div>
      </FadeIn>

      <FadeIn delay={120}>
        <div className="msc-kpi">
          {MSC_PROJECT.results.map((r) => (
            <div key={r.label} className="msc-metric">
              <span className="msc-metric-value">{r.value}</span>
              <span className="msc-metric-label">{r.label}</span>
            </div>
          ))}
        </div>
        <div className="msc-intro">
          <span className="msc-block-label">Conclusion</span>
          <p>{renderRich(MSC_PROJECT.conclusion)}</p>
        </div>
        <div className="msc-intro msc-intro--future">
          <span className="msc-block-label">Future work</span>
          <p>{renderRich(MSC_PROJECT.future)}</p>
        </div>
        <div className="msc-meta-row">
          <div className="compact-tags msc-tags">
            {MSC_PROJECT.tags.map((t) => <span key={t} className={`tag-chip skill-pill--${tagAccent(t)}`}>{t}</span>)}
          </div>
          {MSC_PROJECT.link && (
            <a className="msc-repo" href={MSC_PROJECT.link} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="msc-repo-icon" /> View on GitHub
            </a>
          )}
        </div>
      </FadeIn>
    </div>
    <SectionCorners section="msc" />
  </section>
);

const ProjectsSection = () => (
  <section id="projects" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
    <div className="mx-auto" style={{ width: 'min(84rem,100%)' }}>
      <FadeIn><SectionHeading emoji="🧪" title="Portfolio Projects" /></FadeIn>
      <div className="project-list">
        {PROJECTS.map((project, index) => (
          <FadeIn key={project.title} delay={index * 80}>
            <div className="project-row">
              <TiltCard className="experience-card project-card">
                {project.timeline && <p className="experience-eyebrow">{project.timeline}</p>}
                <h3 className="project-card-heading">{project.title}</h3>
                <ul className="detail-list">
                  {project.bullets.map(b => <li key={b}>{renderRich(b)}</li>)}
                </ul>
                <div className="compact-tags">
                  {project.tags.map((t) => <span key={t} className={`tag-chip skill-pill--${tagAccent(t)}`}>{t}</span>)}
                </div>
                {project.link && (
                  <a className="project-repo-link" href={project.link} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon className="project-repo-icon" /> View repository
                  </a>
                )}
              </TiltCard>
              <div className="project-arch-cell" aria-hidden="true">
                <ProjectArch kind={PROJECT_ARCH[index]} />
              </div>
            </div>
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
    <SceneFx variant="orbits" accent={[244, 63, 94]} />
    <div className="max-w-6xl mx-auto">
      <FadeIn><SectionHeading emoji="🎓" title="Education & Certifications" /></FadeIn>
      <div className="education-grid">
        <FadeIn>
          <TiltCard className="education-card education-card--primary">
            <div className="edu-card-top">
              <div className="edu-icon-ring edu-icon-ring--logo" aria-hidden="true">
                <img className="edu-logo" src="/logos/iitk.png" alt="" onError={hideBrokenLogo} />
                <span className="edu-logo-fallback">🎓</span>
              </div>
              <div>
                <p className="experience-eyebrow">Aug 2021 – Jul 2023</p>
                <h4>M.Sc. in Statistics</h4>
                <p className="edu-institute">Indian Institute of Technology</p>
                <p className="edu-place">Kanpur</p>
              </div>
            </div>
            <div className="edu-stats">
              <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={8} prefix="" suffix="" duration={1500} /></span><span className="edu-stat-dot">.</span><span className="edu-stat-num">9</span><span className="edu-stat-label">CGPA</span></div>
              <div className="edu-stats-right">
                <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={7} duration={1500} /></span><span className="edu-stat-label">JAM AIR</span></div>
                <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={6} duration={1500} /></span><span className="edu-stat-label">Dept. Rank</span></div>
              </div>
            </div>
          </TiltCard>
        </FadeIn>
        <FadeIn delay={100}>
          <TiltCard className="education-card education-card--secondary">
            <div className="edu-card-top">
              <div className="edu-icon-ring edu-icon-ring--logo" aria-hidden="true">
                <img className="edu-logo" src="/logos/bidhannagar.png" alt="" onError={hideBrokenLogo} />
                <span className="edu-logo-fallback">📚</span>
              </div>
              <div>
                <p className="experience-eyebrow">Jun 2018 – Jul 2021</p>
                <h4>B.Sc. in Statistics</h4>
                <p className="edu-institute">Bidhannagar College</p>
                <p className="edu-place">Kolkata</p>
              </div>
            </div>
            <div className="edu-stats">
              <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={9} prefix="" suffix="" duration={1500} /></span><span className="edu-stat-dot">.</span><span className="edu-stat-num">99</span><span className="edu-stat-label">CGPA</span></div>
              <div className="edu-stats-right">
                <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={1} duration={1500} /></span><span className="edu-stat-label">Dept. Rank</span></div>
              </div>
            </div>
          </TiltCard>
        </FadeIn>
      </div>

      <FadeIn delay={160}>
        <div className="cert-block">
          <h4 className="cert-block-title"><span aria-hidden="true">📜</span> Certifications</h4>
          <div className="cert-list">
            {CERTIFICATIONS.map((c) => (
              <a key={c.link ?? c.name} className="cert-row" href={c.link} target="_blank" rel="noopener noreferrer">
                <span className="cert-row-icon" aria-hidden="true">
                  {c.logo ? <img className="cert-row-logo" src={c.logo} alt="" loading="lazy" onError={hideBrokenLogo} /> : '📜'}
                  <span className="cert-row-logo-fallback">📜</span>
                </span>
                <span className="cert-row-name">{c.name}</span>
                {c.issuer && <span className="cert-row-issuer">{c.issuer}</span>}
                <span className="cert-row-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={220}>
        <div className="badge-strip">
          <h4 className="cert-block-title"><span aria-hidden="true">🏅</span> Badges</h4>
          <div className="badge-row">
            {BADGES.map((b) => (
              <a key={b.link} className="badge-medal" href={b.link} target="_blank" rel="noopener noreferrer" title={`${b.name} — ${b.issuer}`} aria-label={`${b.name}, issued by ${b.issuer}`}>
                <span className="badge-medal-art" aria-hidden="true">
                  <span className="badge-ribbon badge-ribbon--l" />
                  <span className="badge-ribbon badge-ribbon--r" />
                  <span className="badge-disc">
                    <MedalFrame />
                    <span className="badge-inner">
                      <BadgeArt img={b.img} />
                    </span>
                  </span>
                </span>
                <span className="badge-name">{b.name}</span>
                <span className="badge-issuer">{b.issuer}</span>
              </a>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
    <SectionCorners section="education" />
  </section>
);

/* Glossy mini-plots that replace the emoji on selected achievement cards. */
const AchievementChart = ({ kind }: { kind: 'reduction' | 'auc' }) => {
  if (kind === 'reduction') {
    const bars = [{ x: 8, h: 30 }, { x: 26, h: 22 }, { x: 44, h: 15 }, { x: 62, h: 9 }];
    return (
      <svg className="achievement-card-chart" viewBox="0 0 80 44" role="img" aria-label="Declining bars showing overdue amounts reduced">
        <defs>
          <linearGradient id="acRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffb3a8" /><stop offset="45%" stopColor="#fb5b46" /><stop offset="100%" stopColor="#b11d10" />
          </linearGradient>
          <filter id="acShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#7a1d10" floodOpacity="0.3" /></filter>
        </defs>
        {bars.map((b, i) => (
          <g key={i} filter="url(#acShadow)">
            <rect x={b.x} y={38 - b.h} width="12" height={b.h} rx="2.5" fill="url(#acRed)" />
            <rect x={b.x + 1.8} y={40 - b.h} width="3" height={b.h - 5} rx="1.5" fill="#fff" opacity="0.32" />
          </g>
        ))}
        <path d="M12 13 L62 29" fill="none" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M62 29 L54.5 28.4 M62 29 L60 21.8" fill="none" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="achievement-card-chart" viewBox="0 0 80 44" role="img" aria-label="ROC curve with a large area under the curve">
      <defs>
        <linearGradient id="acFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc4f7" stopOpacity="0.65" /><stop offset="100%" stopColor="#2f9be8" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="acLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bfe2fb" /><stop offset="100%" stopColor="#0f6fc4" />
        </linearGradient>
      </defs>
      <line x1="8" y1="38" x2="72" y2="38" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="8" y1="38" x2="8" y2="6" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="8" y1="38" x2="72" y2="6" stroke="#9aa7b2" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M8 38 C 16 16, 30 9, 72 7 L72 38 Z" fill="url(#acFill)" />
      <path d="M8 38 C 16 16, 30 9, 72 7" fill="none" stroke="url(#acLine)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 32 C 16 17, 28 11, 48 8.6" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
};

/* ───────── Hobbies — collage / mood-board ───────── */
/* tile slots laid out to mirror the shared collage template, top → bottom */
const HOBBY_SLOTS = ['hero', 'street', 'field', 'flower', 'couch', 'pug', 'ruins'] as const;
/* feature tile + three small photo tiles per mosaic half (the 4th cell holds the quote) */
const MOSAIC_AREAS = ['f', 'a', 'b', 'c'] as const;

const HobbiesSection = () => {
  const [travel, painting, books] = HOBBIES;
  return (
    <section id="hobbies" className="py-32 px-6 bg-spring-section blend-section content-section scroll-section">
      <SceneFx variant="flow" accent={[251, 113, 133]} />
      <div className="mx-auto" style={{ width: 'min(66rem,100%)' }}>
        <FadeIn><SectionHeading emoji="📸" title="Hobbies" /></FadeIn>
        <FadeIn delay={60}><p className="hobbies-intro">Travel, painting &amp; books — collected one frame at a time.</p></FadeIn>
        <FadeIn delay={120}>
          <div className="hobbies-row">
            {/* Card 1 — travel collage template */}
            <div className="hobbies-frame">
              <div className="hobbies-tpl">
                {HOBBY_SLOTS.map((slot, i) => {
                  const src = travel.photos[i];
                  return (
                    <figure key={slot} className="tpl-cell" style={{ gridArea: slot }}>
                      {src && <TileMedia src={src} alt="Travel" />}
                      <span className="tpl-fallback" aria-hidden="true">✈️</span>
                    </figure>
                  );
                })}
              </div>
              <figcaption className="card-quote card-quote--lg">
                <span className="card-quote-emoji" aria-hidden="true">{travel.emoji}</span>
                <span className="card-quote-text">{travel.quote}</span>
              </figcaption>
            </div>

            {/* Cards 2 & 3 — painting and books, each its own card, stacked */}
            <div className="hobbies-stack">
              {[painting, books].map((grp) => (
                <div key={grp.title} className="mosaic-card">
                  <div className={`mosaic-half mosaic-half--${grp.title.toLowerCase()}`}>
                    {grp.photos.slice(0, 4).map((src, i) => (
                      <figure key={src} className="mosaic-tile" style={{ gridArea: MOSAIC_AREAS[i] }}>
                        <TileMedia src={src} alt={grp.title} />
                        <span className="mosaic-fallback" aria-hidden="true">{grp.emoji}</span>
                      </figure>
                    ))}
                    <figcaption className="card-quote card-quote--sm">
                      <span className="card-quote-emoji" aria-hidden="true">{grp.emoji}</span>
                      <span className="card-quote-text">{grp.quote}</span>
                    </figcaption>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
      <SectionCorners section="hobbies" />
    </section>
  );
};

/* ───────── Achievements redesigned ───────── */
const AchievementsSection = () => (
  <section className="achievements-section py-24 px-6 bg-spring-section blend-section">
    <div className="mx-auto" style={{ width: 'min(84rem,100%)' }}>
      <FadeIn><SectionHeading emoji="🏆" title="Key Achievements" /></FadeIn>
      <div className="achievement-grid">
        {ACHIEVEMENTS_DATA.map((a, i) => (
          <FadeIn key={a.label} delay={i * 70} direction="scale">
            <TiltCard className="achievement-card">
              {a.chart
                ? <AchievementChart kind={a.chart} />
                : <span className="achievement-card-emoji" aria-hidden="true">{a.emoji}</span>}
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

export default function App() {
  return (
    <div className="spring-page font-sans">
      <CursorGlow />
      <ScrollProgress />
      <SiteNav />

      <Hero />

      {/* ───── ACHIEVEMENTS ───── */}
      <AchievementsSection />

      {/* ───── SKILLS ───── */}
      <SkillsSection />

      {/* ───── EXPERIENCE ───── */}
      <ExperienceSection />
      <MscProjectSection />
      <ProjectsSection />
      <EducationSection />

      {/* ───── HOBBIES ───── */}
      <HobbiesSection />

      {/* ───── CONTACT ───── */}
      <section id="contact" className="contact-page-section px-6 bg-spring-section blend-section scroll-section">
        <SceneFx variant="ripples" accent={[56, 189, 248]} />
        <div className="max-w-4xl mx-auto contact-section">
          <FadeIn><SectionHeading emoji="📬" title="Get in Touch" /></FadeIn>
          <FadeIn delay={100}>
            <p className="text-spring-muted text-lg mb-8">
              Open to data science roles, collaborations, forecasting systems, MLOps work, and interesting analytics problems. Let&apos;s build something impactful together.
            </p>
          </FadeIn>
          <div className="contact-links">
            <a href={PROFILE_LINKS.email} className="contact-card"><GmailIcon className="contact-card-icon" /><span>Mail me</span><small className="contact-detail">ghoshprithwijit39@gmail.com</small></a>
            <a href={PROFILE_LINKS.phone} className="contact-card"><span aria-hidden="true">📞</span><span>Call me</span><small className="contact-detail">+91-7595986858</small></a>
            <a href={PROFILE_LINKS.github} className="contact-card" target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="contact-card-icon" /><span>GitHub</span><small className="contact-detail">github.com/Prithwijit24</small>
            </a>
            <a href={PROFILE_LINKS.linkedin} className="contact-card" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="contact-card-icon" /><span>LinkedIn</span><small className="contact-detail">linkedin.com/in/prithwijit-ghosh-datascience</small>
            </a>
            <a href={PROFILE_LINKS.resume} className="contact-card" target="_blank" rel="noopener noreferrer">
              <DownloadIcon className="contact-card-icon" /><span>Resume</span>
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
