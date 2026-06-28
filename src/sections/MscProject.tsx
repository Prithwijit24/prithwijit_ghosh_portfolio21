import { MSC_PROJECT } from '../data';
import { SectionShell } from '../components/SectionShell';
import { SectionHeading, Reveal, TiltCard } from '../components/primitives';
import { MscProjectModel } from '../components/scenes/MscProjectModel';

export const MscProject = () => (
  <SectionShell id="msc" accentKey="msc" contentClassName="max-w-5xl">
    <Reveal><SectionHeading emoji="🎓" title="MSc Final Project" /></Reveal>
    <div className="msc-layout">
      <Reveal rotateY={-12}>
        <TiltCard className="msc-card">
          <p className="msc-placeholder-badge">[PLACEHOLDER — replace with real project content]</p>
          <h3 className="msc-title">{MSC_PROJECT.title}</h3>
          <p className="msc-summary">{MSC_PROJECT.summary}</p>
          <div className="msc-block">
            <h5 className="msc-block-title">Problem</h5>
            <p className="msc-block-text">{MSC_PROJECT.problem}</p>
          </div>
          <div className="msc-block">
            <h5 className="msc-block-title">Approach</h5>
            <p className="msc-block-text">{MSC_PROJECT.approach}</p>
          </div>
          <div className="msc-metrics">
            {MSC_PROJECT.results.map(r => (
              <div key={r.label} className="msc-metric">
                <strong className="msc-metric-value">{r.value}</strong>
                <span className="msc-metric-label">{r.label}</span>
              </div>
            ))}
          </div>
          <div className="compact-tags">
            {MSC_PROJECT.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
          </div>
        </TiltCard>
      </Reveal>
      <MscProjectModel />
    </div>
  </SectionShell>
);
