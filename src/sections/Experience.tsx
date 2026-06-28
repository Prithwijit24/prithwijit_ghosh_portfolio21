import { EXPERIENCE_ITEMS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading } from '../components/primitives';
import { ExperienceTimeline3D } from '../components/scenes/ExperienceTimeline3D';

export const Experience = () => (
  <SectionShell id="experience" accentKey="experience" contentClassName="max-w-6xl">
    <SectionHeading emoji="💼" title="Professional Experience" />
    <ExperienceTimeline3D items={EXPERIENCE_ITEMS} />
  </SectionShell>
);
