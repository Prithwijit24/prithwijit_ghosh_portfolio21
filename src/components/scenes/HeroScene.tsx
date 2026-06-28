import { HeroSignalPanel } from './HeroSignalPanel';

export const HeroScene = () => (
  <div className="hero-scene scene-3d">
    <div className="hero-scene-depth hero-scene-depth--back" aria-hidden="true" />
    <div className="hero-scene-depth hero-scene-depth--mid" aria-hidden="true" />
    <div className="hero-scene-panel">
      <HeroSignalPanel />
    </div>
  </div>
);
