import type { CSSProperties } from 'react';

const ORBIT_SKILLS = ['Python', 'SQL', 'AWS', 'Spark', 'ML', 'BI', 'RAG', 'Stats'];

export const SkillsConstellation = () => (
  <div className="skills-constellation scene-3d" aria-hidden="true">
    <div className="constellation-core">
      <span>DS</span>
    </div>
    <div className="constellation-ring constellation-ring--outer">
      {ORBIT_SKILLS.map((skill, index) => (
        <span key={skill} className="constellation-node" style={{ '--i': index } as CSSProperties}>
          {skill}
        </span>
      ))}
    </div>
    <div className="constellation-ring constellation-ring--inner">
      {['📊', '🧠', '☁️', '📈'].map((icon, index) => (
        <span key={icon} className="constellation-icon" style={{ '--i': index } as CSSProperties}>
          {icon}
        </span>
      ))}
    </div>
  </div>
);
