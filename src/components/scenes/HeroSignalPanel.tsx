import { useEffect, useRef } from 'react';

// A looping "daily run" terminal. The date is generated at runtime so every
// visitor sees the current day's log. Lines type out character-by-character,
// auto-scroll, and replay. Colour comes from per-segment classes + emojis.
type LogLine =
  | { p: true; body: string }
  | { hdr: true; body: string }
  | { t: string; c?: string; body: string };

const LOG: LogLine[] = [
  { p: true, body: 'python data_science.py --run daily' },
  { hdr: true, body: '# {DATE} · daily pipeline' },
  { t: '09:01:02', body: '☕ booting up… good morning!' },
  { t: '09:01:06', c: 'c', body: '📥 pulling fresh data from warehouse … 2.4M rows' },
  { t: '09:01:11', body: '🧹 cleaning & deduping … 18,204 dupes dropped' },
  { t: '09:01:16', body: '🩹 imputing missing values … 0.4% filled' },
  { t: '09:01:22', body: '🔧 engineering features … 126 features built' },
  { t: '09:01:28', body: '📊 EDA → seasonality + trend detected' },
  { t: '09:01:33', body: '✂️ train / val / test split … 70 / 15 / 15' },
  { t: '09:01:38', body: '🧠 training ensemble [Prophet · LightGBM · XGBoost · Theta]' },
  { t: '09:01:43', c: 'a', body: '   epoch 10/60   loss 0.182 ↓   val_auc 0.84' },
  { t: '09:01:51', c: 'a', body: '   epoch 25/60   loss 0.119 ↓   val_auc 0.89' },
  { t: '09:02:00', c: 'a', body: '   epoch 40/60   loss 0.081 ↓   val_auc 0.93' },
  { t: '09:02:09', c: 'g', body: '   epoch 60/60   loss 0.054 ✓   val_auc 0.96' },
  { t: '09:02:13', body: '🎯 hyperparam search (Optuna) … 120 trials' },
  { t: '09:02:19', c: 'g', body: '🏆 best params found · cv_score 0.951' },
  { t: '09:02:24', body: '🔁 backtesting 24-month horizon … MAPE 4.6%' },
  { t: '09:02:30', c: 'g', body: '🧪 142 unit + data tests … all passed ✅' },
  { t: '09:02:35', body: '📦 packaging model → Docker image (1.1 GB)' },
  { t: '09:02:41', c: 'g', body: '⚙️ CI pipeline (GitHub Actions) … green ✓' },
  { t: '09:02:46', c: 'c', body: '☁️ deploying to cloud … 🚀 live' },
  { t: '09:02:51', body: '📡 monitoring: drift check … nominal' },
  { t: '09:02:55', body: '🔔 alerts armed · SLA 99.9%' },
  { t: '09:03:00', body: '💬 posting update to #ml-team … done' },
  { t: '09:03:04', c: 'g', body: '✅ pipeline complete · shipped another one!' },
  { t: '09:03:06', c: 'v', body: '😎 grabbing coffee while it serves predictions ☕' },
];

type Seg = { c: string; t: string };
const segsFor = (date: string) => (o: LogLine): Seg[] => {
  if ('p' in o) return [{ c: 'g', t: '$ ' }, { c: '', t: o.body }];
  if ('hdr' in o) return [{ c: 'mut', t: o.body.replace('{DATE}', date) }];
  return [{ c: 'mut', t: `[${o.t}] ` }, { c: o.c ?? '', t: o.body }];
};

export const HeroSignalPanel = () => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const log = logRef.current;
    if (!body || !log) return;

    const dt = new Date();
    const date = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    const lines = LOG.map(segsFor(date));
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lineHTML = (segs: Seg[]) => segs.map((s) => `<span class="${s.c}">${esc(s.t)}</span>`).join('');

    // Respect reduced-motion: show the whole log, no typing.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      log.innerHTML = lines.map(lineHTML).join('\n');
      return;
    }

    let out = '';
    let li = 0;
    let si = 0;
    let ci = 0;
    let chars: string[] | null = null;
    let timer = 0;
    const seg = () => lines[li][si];
    const render = (partial: string | null) => {
      log.innerHTML =
        out +
        (partial != null ? `<span class="${seg().c}">${esc(partial)}</span>` : '') +
        '<span class="term-cursor">.</span>';
      body.scrollTop = body.scrollHeight;
    };
    const tick = () => {
      if (li >= lines.length) { timer = window.setTimeout(reset, 3200); return; }
      if (chars === null) { chars = Array.from(seg().t); ci = 0; }
      if (ci < chars.length) {
        ci++;
        render(chars.slice(0, ci).join(''));
        timer = window.setTimeout(tick, 18);
      } else {
        out += `<span class="${seg().c}">${esc(seg().t)}</span>`;
        si++;
        chars = null;
        if (si >= lines[li].length) { out += '\n'; li++; si = 0; render(null); timer = window.setTimeout(tick, 220); }
        else { render(null); timer = window.setTimeout(tick, 10); }
      }
    };
    const reset = () => { out = ''; li = 0; si = 0; ci = 0; chars = null; render(null); timer = window.setTimeout(tick, 700); };

    render(null);
    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="hero-panel hero-panel--terminal">
      <div className="mac-titlebar">
        <div className="traffic-lights">
          <div className="traffic-light red" aria-hidden="true" />
          <div className="traffic-light yellow" aria-hidden="true" />
          <div className="traffic-light green" aria-hidden="true" />
        </div>
        <div className="mac-title">data_science.py — bash</div>
      </div>
      <div className="term-body" ref={bodyRef} aria-hidden="true"><pre ref={logRef} className="term-log" /></div>
    </div>
  );
};
