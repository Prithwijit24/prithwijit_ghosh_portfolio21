import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal, TiltCard, AnimatedCounter } from '../components/primitives';
import { EducationCape } from '../components/scenes/EducationCape';

const ACADEMIC_HONORS = [
  { stat: '7', label: 'JAM AIR (Statistics)' },
  { stat: '89.9', label: 'M.Sc. CGPA / IIT Kanpur' },
  { stat: '6', label: 'Dept. Rank / IIT Kanpur' },
  { stat: '1', label: 'Dept. Rank / B.Sc.' }
];

export const Education = () => (
  <SectionShell id="education" accentKey="education" contentClassName="max-w-5xl">
    <Reveal><SectionHeading emoji="🎓" title="Education & Achievements" /></Reveal>
    <div className="education-grid">
      <Reveal rotateY={-15}>
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
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={89} duration={1500} /></span><span className="edu-stat-dot">.</span><span className="edu-stat-num">9</span><span className="edu-stat-label">CGPA</span></div>
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={7} duration={1500} /></span><span className="edu-stat-label">JAM AIR</span></div>
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={6} duration={1500} /></span><span className="edu-stat-label">Dept. Rank</span></div>
          </div>
        </TiltCard>
      </Reveal>
      <Reveal delay={100} rotateY={15}>
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
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={999} duration={1500} /></span><span className="edu-stat-dot">.</span><span className="edu-stat-num">99</span><span className="edu-stat-label">CGPA</span></div>
            <div className="edu-stat"><span className="edu-stat-num"><AnimatedCounter target={1} duration={1500} /></span><span className="edu-stat-label">Dept. Rank</span></div>
          </div>
        </TiltCard>
      </Reveal>
    </div>

    <Reveal delay={150}>
      <div className="academic-honors">
        <h5 className="academic-honors-title">Academic Honors</h5>
        <div className="academic-honors-grid">
          {ACADEMIC_HONORS.map(h => (
            <div key={h.label} className="academic-honor">
              <strong className="academic-honor-stat">{h.stat}</strong>
              <span className="academic-honor-label">{h.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>

    <EducationCape />
  </SectionShell>
);
