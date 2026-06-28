import { PROJECTS, PROFILE_LINKS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal } from '../components/primitives';
import { ProjectShowcase } from '../components/scenes/ProjectShowcase';
import { GitHubIcon } from '../components/Icons';

export const PortfolioProjects = () => (
  <SectionShell id="projects" accentKey="projects" contentClassName="max-w-6xl">
    <Reveal><SectionHeading emoji="🧪" title="Portfolio Projects" /></Reveal>
    <ProjectShowcase projects={PROJECTS} />
    <Reveal delay={280}>
      <div className="projects-see-more">
        <span className="projects-ellipsis" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
        <a className="projects-github-link" href={PROFILE_LINKS.github} target="_blank" rel="noopener noreferrer">
          <GitHubIcon className="projects-github-icon" />
          See more on GitHub
        </a>
      </div>
    </Reveal>
  </SectionShell>
);
