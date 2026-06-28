import { SKILL_DOMAINS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal, TiltCard, SkillBar } from '../components/primitives';
import { SkillsConstellation } from '../components/scenes/SkillsConstellation';

export const Skills = () => (
  <SectionShell id="skills" accentKey="skills" contentClassName="max-w-6xl">
    <Reveal><SectionHeading emoji="🧰" title="Skills & Expertise" /></Reveal>
    <div className="skills-layout">
      <div className="skills-grid">
        {SKILL_DOMAINS.map((domain, index) => (
          <Reveal key={domain.title} delay={index * 70} rotateY={-18}>
            <TiltCard className={`skill-card skill-card--${domain.accent}`}>
              <div className="skill-card-header">
                <span className="skill-card-icon" aria-hidden="true">{domain.emoji}</span>
                <h4 className="skill-card-title">{domain.title}</h4>
              </div>
              <p className="skill-card-desc">{domain.description}</p>
              <SkillBar level={domain.level} accent={domain.accent} />
              <ul className="skill-pill-list">
                {domain.skills.map(skill => (
                  <li key={skill} className={`tag-chip skill-pill--${domain.accent}`}>{skill}</li>
                ))}
              </ul>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <SkillsConstellation />
    </div>
  </SectionShell>
);
