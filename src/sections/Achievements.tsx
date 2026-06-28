import { ACHIEVEMENTS_DATA } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal, TiltCard } from '../components/primitives';

export const Achievements = () => (
  <SectionShell id="achievements" accentKey="achievements" contentClassName="max-w-7xl">
    <Reveal><SectionHeading emoji="🏆" title="Key Achievements" /></Reveal>
    <div className="achievement-grid">
      {ACHIEVEMENTS_DATA.map((a, i) => (
        <Reveal key={a.label} delay={i * 70} rotateY={0}>
          <TiltCard className="achievement-card">
            <div className="achievement-accent" style={{ animationDelay: `${-i * 0.6}s` }} />
            <div className="achievement-card-body">
              <strong className="achievement-card-stat">{a.stat}</strong>
              <span className="achievement-card-label">{a.label}</span>
              <span className="achievement-card-desc">{a.desc}</span>
            </div>
          </TiltCard>
        </Reveal>
      ))}
    </div>
  </SectionShell>
);
