import { CERTIFICATIONS } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading } from '../components/primitives';
import { CertRibbon } from '../components/scenes/CertRibbon';

export const Certifications = () => (
  <SectionShell id="certifications" accentKey="certifications" contentClassName="max-w-6xl">
    <SectionHeading emoji="📜" title="Certifications & Workshops" />
    <p className="cert-placeholder-note">[PLACEHOLDER — replace with real certifications and workshops]</p>
    <CertRibbon certs={CERTIFICATIONS} />
  </SectionShell>
);
