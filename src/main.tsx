import { createRoot } from 'react-dom/client';
import './style.css';

import {
  PROFILE_LINKS, SKILL_DOMAINS, EXPERIENCE_ITEMS, PROJECTS, ACHIEVEMENTS_DATA
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
import { ProjectArch, type ArchKind } from './components/ProjectArch';
import { Hero } from './sections/Hero';
import {
  GitHubIcon, LinkedInIcon
} from './components/Icons';

/* per-project architecture diagrams, in PROJECTS order */
const PROJECT_ARCH: ArchKind[] = ['recommender', 'fraud', 'travel', 'music'];

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
                  {item.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
                <div className="compact-tags">
                  {item.tags.map((t, i) => <span key={t} className={`tag-chip skill-pill--${['blossom','mint','sunshine','sky'][i % 4]}`}>{t}</span>)}
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
    <SectionCorners section="experience" />
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
                  {project.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
                <div className="compact-tags">
                  {project.tags.map((t, i) => <span key={t} className={`tag-chip skill-pill--${['blossom','mint','sunshine','sky'][i % 4]}`}>{t}</span>)}
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
    <SectionCorners section="education" />
  </section>
);

/* ───────── Achievements redesigned ───────── */
const AchievementsSection = () => (
  <section className="achievements-section py-24 px-6 bg-spring-section blend-section">
    <div className="mx-auto" style={{ width: 'min(84rem,100%)' }}>
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
      <ProjectsSection />
      <EducationSection />

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
