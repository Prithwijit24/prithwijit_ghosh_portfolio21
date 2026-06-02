import { type FormEvent, type ReactNode, type RefObject, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

if (typeof document !== 'undefined') {
  const styleId = 'cinematic-transitions';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .will-change-transform {
      will-change: transform, opacity, filter;
      backface-visibility: hidden;
      transform-style: preserve-3d;
    }
  `;
    document.head.appendChild(style);
  }
}

function useElementScroll(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScroll = Math.max(1, rect.height - windowHeight);
      const currentScroll = -rect.top;

      setProgress(Math.max(0, Math.min(1, currentScroll / totalScroll)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return progress;
}

type TransitionSceneProps = {
  image1: string;
  image2: string;
  text1: string;
  text2: string;
};

const TransitionScene = ({ image1, image2, text1, text2 }: TransitionSceneProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progress = useElementScroll(containerRef);

  const img1Opacity =
    progress < 0.55 ? 1 : Math.max(0, 1 - (progress - 0.55) * 4);

  const img2Opacity =
    progress < 0.45 ? 0 : Math.min(1, (progress - 0.45) * 4);

  const img1Scale = 1 + progress * 0.8;
  const img2Scale = 1.8 - progress * 0.8;

  const img1Y = progress * -120;
  const img2Y = (1 - progress) * 120;

  const transitionPeak = Math.sin(progress * Math.PI);

  const img1Blur = transitionPeak * 12;
  const img2Blur = (1 - progress) * 10;

  const flashOpacity =
    Math.max(
      0,
      Math.sin(Math.max(0, Math.min(1, (progress - 0.4) / 0.2)) * Math.PI)
    ) * 0.35;

  const sweepX = -120 + progress * 240;

  const text1Opacity =
    progress < 0.35 ? 1 : Math.max(0, 1 - (progress - 0.35) * 4);

  const text2Opacity =
    progress < 0.55 ? 0 : Math.min(1, (progress - 0.55) * 4);

  const text1Translate = Math.max(0, progress - 0.2) * 150;
  const text2Translate = (1 - text2Opacity) * 150;

  return (
    <div ref={containerRef} className="relative transition-scroll">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        <div
          className="absolute inset-0 bg-cover will-change-transform"
          style={{
            backgroundImage: `url(${image1})`,
            backgroundPosition: `center ${50 + progress * 8}%`,
            opacity: img1Opacity,
            transform: `scale(${img1Scale}) translateY(${img1Y}px)`,
            filter: `blur(${img1Blur}px) brightness(${100 + transitionPeak * 30}%)`
          }}
        />

        <div
          className="absolute inset-0 bg-cover will-change-transform"
          style={{
            backgroundImage: `url(${image2})`,
            backgroundPosition: `center ${58 - progress * 8}%`,
            opacity: img2Opacity,
            transform: `scale(${img2Scale}) translateY(${img2Y}px)`,
            filter: `blur(${img2Blur}px)`
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent)',
            transform: `translateX(${sweepX}%)`,
            mixBlendMode: 'screen'
          }}
        />

        <div
          className="absolute inset-0 bg-white pointer-events-none"
          style={{ opacity: flashOpacity }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,.55) 100%)'
          }}
        />

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 scene-edge-fade pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6 overflow-hidden">

          <h2
            className="absolute text-white font-black tracking-tight text-5xl md:text-8xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            style={{
              opacity: text1Opacity,
              transform: `translateY(-${text1Translate}px) scale(${0.9 + text1Opacity * 0.1})`,
              filter: `blur(${(1 - text1Opacity) * 12}px)`
            }}
          >
            {text1}
          </h2>

          <h2
            className="absolute text-white font-black tracking-tight text-5xl md:text-8xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            style={{
              opacity: text2Opacity,
              transform: `translateY(${text2Translate}px) scale(${0.9 + text2Opacity * 0.1})`,
              filter: `blur(${(1 - text2Opacity) * 12}px)`
            }}
          >
            {text2}
          </h2>

        </div>
      </div>
    </div>
  );
};

type FadeInProps = {
  children: ReactNode;
  delay?: number;
};

const FadeIn = ({ children, delay = 0 }: FadeInProps) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(entries[0].target);
      }
    }, { rootMargin: '0px 0px -100px 0px' });

    const node = domRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const DataNodesAnimation = () => (
  <div className="relative w-full h-48 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50 flex items-center justify-center">
    <div className="absolute flex space-x-12">
      <div className="flex flex-col space-y-4">{[1, 2, 3].map(i => <div key={`in-${i}`} className="w-3 h-3 rounded-full bg-slate-700" />)}</div>
      <div className="flex flex-col space-y-8 justify-center">{[1, 2].map(i => <div key={`hid-${i}`} className="w-4 h-4 rounded-full bg-teal-500" />)}</div>
      <div className="flex flex-col justify-center"><div className="w-5 h-5 rounded-full bg-blue-500" /></div>
    </div>
  </div>
);

const SparklesIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 14l.6 1.6L7 16l-1.4.4L5 18l-.6-1.6L3 16l1.4-.4L5 14z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SendIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22 2 11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m22 2-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LoaderIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HeroSignalPanel = () => (
  <div className="hero-panel">
    <div className="hero-panel-header">
      <span className="status-dot" />
      <span>Model pipeline active</span>
    </div>
    <div className="metric-grid">
      <div>
        <strong>15%</strong>
        <span>Efficiency lift</span>
      </div>
      <div>
        <strong>3+</strong>
        <span>Years applied ML</span>
      </div>
      <div>
        <strong>IITK</strong>
        <span>Statistics foundation</span>
      </div>
      <div>
        <strong>AWS</strong>
        <span>Cloud ETL systems</span>
      </div>
    </div>
    <div className="calm-visual" aria-hidden="true">
      <div className="calm-chart">
        <span style={{ height: '42%' }} />
        <span style={{ height: '64%' }} />
        <span style={{ height: '52%' }} />
        <span style={{ height: '78%' }} />
        <span style={{ height: '68%' }} />
      </div>
      <div className="pie-chart">
        <span />
      </div>
      <div className="calm-summary">
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>
);

const AICloneChat = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true); setError(''); setResponse('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResponse("As a Data Scientist from IIT Kanpur with 3 years at Accenture, I specialize in building ML pipelines (Spark/AWS) and NLP solutions. My focus is always on translating raw data into meaningful business decisions. How can I help you understand my experience further?");
    } catch {
      setError("My AI clone is currently sleeping.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(45,212,191,0.1)] relative overflow-hidden">
      <h4 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><SparklesIcon className="text-teal-400 w-6 h-6" /> Interview My AI Clone</h4>
      <p className="text-slate-400 text-sm mb-6">Ask my digital twin about my background.</p>
      <form onSubmit={handleSubmit} className="relative mb-6">
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Have you worked with cloud ETL pipelines?"
          className="w-full bg-slate-950 border border-slate-700 rounded-lg py-4 pl-4 pr-16 text-slate-200"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-500/10 text-teal-400 rounded-md">
          {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SendIcon className="w-5 h-5" />}
        </button>
      </form>
      {(response || error) && (
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 text-slate-300">
          <p className="text-sm">{error || response}</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const IMAGES = {
    jungle: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2000&q=80",
    road: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=2000&q=80",
    mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
    city: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80",
    space: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80",
    forest: "https://images.unsplash.com/photo-1498050106439-482786f9d7ea?auto=format&fit=crop&w=2000&q=80",
    sea: "https://images.unsplash.com/photo-1475113548554-5a3690a74604?auto=format&fit=crop&w=2000&q=80"
  };

  return (
    <div className="bg-slate-950 text-slate-200 font-sans">
      <section className="hero-section h-screen px-6">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-a" aria-hidden="true" />
        <div className="hero-glow hero-glow-b" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-kicker">Data science portfolio</div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">Data Scientist.<br /><span className="text-slate-500">Problem Solver.</span></h1>
            <p className="text-lg md:text-xl text-slate-400">M.Sc. Statistics @ IIT Kanpur | 3+ Years @ Accenture</p>
            <div className="hero-tags">
              <span>ML pipelines</span>
              <span>NLP systems</span>
              <span>Cloud ETL</span>
            </div>
          </div>
          <HeroSignalPanel />
        </div>
      </section>

      <TransitionScene image1={IMAGES.jungle} image2={IMAGES.road} text1="Navigating the wilderness of raw data." text2="Paving the road to actionable insights." />

      <section className="py-32 px-6 bg-slate-950 blend-section content-section">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <h3 className="text-3xl font-bold mb-6">The Analytical Foundation</h3>
            <p className="text-slate-400 text-lg">My foundation is built on rigorous mathematics. From IIT Kanpur to Accenture, I translate theory into impact.</p>
          </FadeIn>
          <DataNodesAnimation />
        </div>
      </section>

      <TransitionScene image1={IMAGES.road} image2={IMAGES.mountain} text1="Scaling complex architectures." text2="Reaching peak model performance." />

      <section className="py-32 px-6 bg-slate-950 blend-section content-section">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-16">Professional Experience</h3>
          <div className="space-y-12">
            <FadeIn>
              <h4 className="text-2xl font-bold text-white">Data Scientist @ Accenture</h4>
              <p className="text-slate-400">Architected scalable ETL pipelines and deployed ML models that improved operational efficiency by 15%.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      <TransitionScene image1={IMAGES.mountain} image2={IMAGES.city} text1="From isolated algorithms..." text2="To enterprise-scale deployments." />

      <section className="py-32 px-6 bg-slate-950 blend-section content-section">
        <div className="max-w-4xl mx-auto">
          <AICloneChat />
        </div>
      </section>
    </div>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

createRoot(rootElement).render(<App />);
