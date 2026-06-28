import { type Certification } from '../../data';
import { Reveal, TiltCard } from '../primitives';

export const CertRibbon = ({ certs }: { certs: Certification[] }) => (
  <div className="cert-ribbon-scene">
    <div className="cert-ribbon-path" aria-hidden="true" />
    <div className="cert-grid">
    {certs.map((cert, i) => (
      <Reveal key={cert.name + i} delay={i * 70} rotateY={-12}>
        <TiltCard className="cert-card">
          <div className="cert-seal" aria-hidden="true">📜</div>
          <h4 className="cert-name">{cert.name}</h4>
          <p className="cert-issuer">{cert.issuer}</p>
          <p className="cert-date">{cert.date}</p>
          {cert.credentialId && <p className="cert-id">ID: {cert.credentialId}</p>}
        </TiltCard>
      </Reveal>
    ))}
    </div>
  </div>
);
