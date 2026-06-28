import { PROFILE_LINKS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal } from '../components/primitives';
import { ContactOrbit } from '../components/scenes/ContactOrbit';
import { MailIcon, PhoneIcon, GitHubIcon, LinkedInIcon, DocIcon } from '../components/Icons';

export const Contact = () => (
  <SectionShell id="contact" accentKey="contact" contentClassName="max-w-4xl" className="contact-page-section">
    <Reveal><SectionHeading emoji="📬" title="Get in Touch" /></Reveal>
    <Reveal delay={100}>
      <p className="text-spring-muted text-lg mb-8">
        Open to data science roles, collaborations, forecasting systems, MLOps work, and interesting analytics problems. Let&apos;s build something impactful together.
      </p>
    </Reveal>
    <ContactOrbit
      channels={[
        { label: 'Email me', href: PROFILE_LINKS.email, Icon: MailIcon },
        { label: 'Call me', href: PROFILE_LINKS.phone, Icon: PhoneIcon },
        { label: 'GitHub', href: PROFILE_LINKS.github, Icon: GitHubIcon, external: true },
        { label: 'LinkedIn', href: PROFILE_LINKS.linkedin, Icon: LinkedInIcon, external: true },
        { label: 'Resume', href: PROFILE_LINKS.resume, Icon: DocIcon, external: true }
      ]}
    />
  </SectionShell>
);
