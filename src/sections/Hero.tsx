import { useState } from 'react';
import { PROFILE_LINKS } from '../data';
import { FadeIn } from '../components/primitives';
import { DataNetworkCanvas } from '../components/decorations';
import { HeroScene } from '../components/scenes/HeroScene';
import { DownloadIcon } from '../components/Icons';

export const Hero = () => {
  const [storyOpen, setStoryOpen] = useState(false);
  return (
    <section id="home" className="hero-section px-6 scroll-section">
      <DataNetworkCanvas />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-kicker icon-chip">🚀 DATA SCIENCE · FORECASTING · MLOPS</div>
            <h4 className="hero-title spring-gradient-text">
              <span className="hero-accent-line">I am Prithwijit Ghosh</span>
            </h4>
            <div className="hero-timeline">
              <div className="hero-timeline-item">
                <span className="hero-timeline-badge" aria-hidden="true">🚀</span>
                <div className="hero-timeline-text">
                  <span className="hero-timeline-role">Data Science Specialist</span>
                  <span className="hero-timeline-sep" aria-hidden="true">|</span>
                  <span className="hero-timeline-org">Accenture</span>
                </div>
              </div>
              <div className="hero-timeline-item">
                <span className="hero-timeline-badge" aria-hidden="true">💼</span>
                <div className="hero-timeline-text">
                  <span className="hero-timeline-role">Data Scientist</span>
                  <span className="hero-timeline-sep" aria-hidden="true">|</span>
                  <span className="hero-timeline-org">Accenture</span>
                </div>
              </div>
              <div className="hero-timeline-item">
                <span className="hero-timeline-badge" aria-hidden="true">🎓</span>
                <div className="hero-timeline-text">
                  <span className="hero-timeline-role">M.Sc. Statistics</span>
                  <span className="hero-timeline-sep" aria-hidden="true">|</span>
                  <span className="hero-timeline-org">IIT Kanpur</span>
                </div>
              </div>
            </div>
            <div className="hero-tags">
              <span className="tag-blossom icon-chip" aria-label="Forecasting models">🤖 Forecasting</span>
              <span className="tag-mint icon-chip" aria-label="Risk scoring">💬 Risk scoring</span>
              <span className="tag-sky icon-chip" aria-label="MLOps on AWS">☁️ MLOps</span>
              <a className="hero-resume-link" href={PROFILE_LINKS.resume} target="_blank" rel="noopener noreferrer">
                <DownloadIcon className="hero-resume-icon" />
                Resume
              </a>
            </div>
          </div>
          <div className="hero-scene-col">
            <HeroScene />
            <button
              type="button"
              className="hero-story-toggle"
              aria-expanded={storyOpen}
              aria-controls="about-story"
              onClick={() => setStoryOpen((o) => !o)}
            >
              <span>{storyOpen ? 'Hide details' : 'About me'}</span>
              <span aria-hidden="true">{storyOpen ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>

        <div id="about-story" className={`about-story about-story--full ${storyOpen ? 'about-story--open' : ''}`}>
          <div className="about-story-inner">
            <FadeIn>
              <div className="about-section-text">
                <div className="section-heading">
                  <h4 className="text-3xl font-bold about-me-heading">About Me</h4>
                </div>
                <p className="text-spring-muted text-base leading-relaxed">
                  <b>Data Scientist Specialist</b> at Accenture with 3+ years of experience and an IIT Kanpur Master&apos;s in Statistics. I build and deploy <strong>forecasting, risk, and analytics</strong> systems across finance, payments-adjacent, sales, and operations domains.
                </p>
                <p className="text-spring-muted text-base mt-4 leading-relaxed">
                  My work spans sales and guest-count forecasting, accounts receivable forecasting, late-payment prediction, cash-flow forecasting, marketing analytics, Power BI dashboards, and production <strong>MLOps</strong> with Docker, GitHub Actions, Airflow, Astronomer, and AWS Fargate.
                </p>
                <p className="text-spring-muted text-base mt-4 leading-relaxed">
                  💡 When I&apos;m not wrangling data pipelines, you&apos;ll find me exploring <strong>AI agents</strong>, contributing to open-source ML projects, or diving into the latest in MLOps and LLM research.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
