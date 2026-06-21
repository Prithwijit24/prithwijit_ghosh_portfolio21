import { AnimatedCounter } from '../primitives';

export const HeroSignalPanel = () => (
  <div className="hero-panel">
    <div className="hero-panel-header">
      <span className="status-dot" />
      <span>📊 Live metrics · Production analytics</span>
    </div>
    <div className="metric-grid">
      <div><span className="metric-emoji" aria-hidden="true">📈</span><span className="metric-value"><strong><AnimatedCounter target={99} suffix="%" />–<AnimatedCounter target={97} suffix="%" /></strong></span><span>24-month forecast accuracy</span></div>
      <div><span className="metric-emoji" aria-hidden="true">🤖</span><strong><AnimatedCounter target={450} suffix="+" /></strong><span>Forecasting models evaluated</span></div>
      <div><span className="metric-emoji" aria-hidden="true">🎓</span><strong><AnimatedCounter target={90} suffix="%" /></strong><span>Due-month AUC</span></div>
      <div><span className="metric-emoji" aria-hidden="true">☁️</span><strong><AnimatedCounter target={6} suffix="M+" /></strong><span>Cash-flow records</span></div>
    </div>
    <div className="calm-visual" aria-hidden="true">
      <div className="calm-chart">
        <span style={{ height: '42%' }} /><span style={{ height: '64%' }} /><span style={{ height: '52%' }} /><span style={{ height: '78%' }} /><span style={{ height: '68%' }} />
      </div>
      <div className="pie-chart"><span /></div>
      <div className="calm-summary">
        <span /><span /><span />
      </div>
    </div>
  </div>
);
