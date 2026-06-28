import { type ProjectItem } from '../../data';
import { Reveal } from '../primitives';

export const ProjectShowcase = ({ projects }: { projects: ProjectItem[] }) => (
  <div className="project-grid">
    {projects.slice(0, 3).map((project, index) => (
      <Reveal key={project.title} delay={index * 80} rotateY={-10}>
        <article className="project-flip-card" tabIndex={0}>
          <div className="project-flip-inner">
            <div className="project-card project-card--front">
              {project.timeline && <p className="experience-eyebrow">{project.timeline}</p>}
              <h3 className="project-card-heading">{project.title}</h3>
              <p>{project.summary}</p>
              <div className="compact-tags">
                {project.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
              </div>
              <span className="project-flip-hint">Hover or focus for details</span>
            </div>
            <div className="project-card project-card--back">
              <h3 className="project-card-heading">{project.title}</h3>
              <ul className="detail-list">
                {project.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
              {project.link && <a className="text-link" href={project.link} target="_blank" rel="noopener noreferrer">View repository</a>}
            </div>
          </div>
        </article>
      </Reveal>
    ))}
  </div>
);
