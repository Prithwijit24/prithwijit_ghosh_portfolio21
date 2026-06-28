import { type ExperienceItem } from '../../data';
import { Reveal, TiltCard } from '../primitives';

export const ExperienceTimeline3D = ({ items }: { items: ExperienceItem[] }) => (
  <div className="experience-list experience-list--3d">
    <div className="experience-ribbon" aria-hidden="true" />
    {items.map((item, index) => (
      <Reveal key={`${item.client}-${item.summary}`} delay={index * 100} rotateY={20}>
        <div className="experience-row experience-row--3d">
          <div className="timeline-node" aria-hidden="true">
            <div className="timeline-dot" style={{ animationDelay: `${index * 0.3}s` }} />
            {index < items.length - 1 && <div className="timeline-line" />}
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
              {item.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
            </div>
          </TiltCard>
        </div>
      </Reveal>
    ))}
  </div>
);
