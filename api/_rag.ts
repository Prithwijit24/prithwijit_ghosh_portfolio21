// RAG core for the "Interview Me" chatbot.
// Knowledge base = Prithwijit Ghosh's résumé + portfolio, chunked.
//
// To rarely hit rate limits, generation fails over (round-robin) across a pool
// of: every Gemini key × every Gemini model (each model has its OWN free quota),
// then optional Groq keys, then optional OpenRouter keys. Embeddings rotate
// across Gemini keys, with a keyword-retrieval fallback if all are exhausted.
// Configure via env (any subset; comma-separate for multiple keys):
//   GEMINI_API_KEY / GEMINI_API_KEYS / GEMINI_API_KEY_2 / GEMINI_API_KEY_3
//   GROQ_API_KEY / GROQ_API_KEYS          (free: https://console.groq.com)
//   OPENROUTER_API_KEY / OPENROUTER_API_KEYS  (free: https://openrouter.ai)

import { HR_QA } from './_hr';

const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const EMB_MODEL = 'gemini-embedding-001';
// Each Gemini model carries its own quota — failing over across them multiplies
// the capacity of even a single key.
const GEMINI_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.0-flash-lite', 'gemini-flash-lite-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
const OPENROUTER_MODELS = ['google/gemma-4-31b-it:free', 'openai/gpt-oss-20b:free', 'meta-llama/llama-3.3-70b-instruct:free'];
// llm7.io — free OpenAI-compatible gateway (needs a free token from https://token.llm7.io)
const LLM7_MODELS = ['default']; // free auto-routed model; named models are balance-gated (402)

const keysFrom = (names: string[]): string[] => {
  const out: string[] = [];
  for (const n of names) {
    const v = process.env[n];
    if (v) for (const part of v.split(',')) { const k = part.trim(); if (k) out.push(k); }
  }
  return [...new Set(out)];
};
const geminiKeys = () => keysFrom(['GEMINI_API_KEYS', 'GEMINI_API_KEY', 'GEMINI_API_KEY_2', 'GEMINI_API_KEY_3', 'GEMINI_API_KEY_4', 'GOOGLE_API_KEY']);
const groqKeys = () => keysFrom(['GROQ_API_KEYS', 'GROQ_API_KEY', 'GROQ_API_KEY_2']);
const openrouterKeys = () => keysFrom(['OPENROUTER_API_KEYS', 'OPENROUTER_API_KEY', 'OPENROUTER_API_KEY_2']);
const llm7Keys = () => keysFrom(['LLM7IO_API_KEY', 'LLM7IO_API_KEYS', 'LLM7IO_TOKEN', 'LLM7_API_KEYS', 'LLM7_API_KEY', 'LLM7_TOKEN', 'LLM7_API_KEY_2']);
const hasAnyKey = () => geminiKeys().length > 0 || groqKeys().length > 0 || openrouterKeys().length > 0 || llm7Keys().length > 0;

/* ───────── Knowledge base (one self-contained passage per chunk) ───────── */
const KB: string[] = [
  `Profile: Prithwijit Ghosh is a Data Scientist Specialist at Accenture Global Technology (Bengaluru, India) with 2.9+ years of experience and an M.Sc. in Statistics from IIT Kanpur. He builds and deploys production-grade forecasting, risk and analytics systems (accounts-receivable, cash flow, sales) in finance and payments-adjacent domains. He works in first person as "I".`,

  `Experience — Multi-Country Sales & Guest-Count Forecasting (Accenture, Global QSR Brand, Jul 2023 – Present): Designed and productionized an ensemble forecasting system predicting sales and guest counts up to 48 months ahead using Prophet, Theta, MSTL, LightGBM and Naive models with macroeconomic indicators across 6 countries. Built a custom horizon-aware evaluation framework (trend & seasonal MAPE) over 450+ models, achieving 97–99% accuracy for 24-month and 95–96% for 48-month forecasts.`,

  `Experience — Forecasting MLOps (Accenture QSR): Implemented a production MLOps pipeline using Docker and GitHub Actions for CI/CD with unit and integration testing plus security scanning (SonarQube, Snyk) before deploying artifacts to JFrog Artifactory. Automated monthly forecasting workflows run via Astronomer on Apache Airflow DAGs on AWS Fargate.`,

  `Experience — Intelligent Collections 3.0 / Late-Payment Risk (Accenture, Water Treatment Brand, Jul 2023 – Present): Built customer-level late-payment prediction with XGBoost, selecting 50 of 1000+ engineered features, reaching 84% due-date AUC and 90% due-month AUC across a 10K+ monthly customer base. Developed calibrated risk scoring (quantile calibration), reducing overdue amounts by 38%, lowering open accounts receivable by 15%, and increasing collections by 12% over the next 2 years after go-live.`,

  `Experience — AR Forecasting & dashboards (Accenture Water Treatment): Designed short-term accounts-receivable forecasting (1–6 month horizon) using statistical methods (SMA, EWMA, ARIMA, SARIMA, Theta, MSTL) and ML/DL models (XGBoost, LightGBM, CatBoost, TCN), achieving 95–98% accuracy across Not Yet Due, Current Due and Over Due categories, delivered through interactive Power BI dashboards for leadership and client reporting.`,

  `Experience — Proof of Concepts (Accenture): Cash Flow Forecasting for a Power Utility — end-to-end B2C cash-flow forecasting over 6M+ customer records, improving Cash-In accuracy to 98% (from 70%) and Cash-Out to 93% (from 64%). Marketing Data Analysis for an internationally renowned liquor brand — customer behavior across subscription patterns, campaigns, conversion funnels, up-sell, cross-sell and churn propensity using RFM and advanced analytics.`,

  `Skills — Programming Languages: Python, SQL, R, Git, GitHub Actions. Tools: MS Excel, MS PowerPoint, Power BI, Redis, Kafka, Prometheus.`,

  `Skills — Cloud Tools: Docker, Kubernetes, FastAPI, Streamlit, Astronomer, Airflow, and AWS (Fargate, EMR/Hadoop, EC2, S3, CloudWatch). Libraries: Pandas, Scikit-learn, XGBoost, LightGBM, NLTK, spaCy, TensorFlow, Keras, LangChain, LangGraph, Ollama.`,

  `Skills — Domains: Data Science, Data Analysis, Predictive Modelling, Classification, NLP, Statistics, Time Series, Business Intelligence (BI), LLMs, AI Agents, and Retrieval-Augmented Generation (RAG).`,

  `Master's Research — "Robust DD-Classifier Under Cell-wise Contamination" (M.Sc. Statistics, IIT Kanpur, 2023; advisors Prof. Subhajit Dutta of IIT Kanpur and Prof. Abhik Ghosh of ISI Kolkata). Cell-wise outliers (corrupted individual entries, not whole rows) break LDA, QDA, KNN and SVM. The Depth–Depth (DD) classifier maps each point from R^d to a 2-D space using Mahalanobis depth w.r.t. each class; estimating location and scatter with cell-wise-robust methods (CellMCD, 2SGS, Detection–Imputation) gives a robust DD space where classes separate cleanly.`,

  `Master's Research — results: Across 100 simulation runs over Normal and t5 populations, location / scale / location–scale shifts, and dimensions from 5 to 25, the robust DD classifiers consistently beat both non-robust and original-space classifiers under cell-wise contamination, with robust-DD misclassification under 1% versus ~52% in raw space in some settings. The 2SGS estimator was the most consistent. Built with R (cellWise, GSE, ggplot2) and Python (numpy, pandas, scikit-learn) bridged via reticulate. Repo: github.com/Prithwijit24/Robust-DD-Classifier-for-Cellwise-Contaminated-Data.`,

  `Project — Agentic Product Recommender (Jun 2025 – Mar 2026): A facial-embedding recommendation engine. FaceNet 512-dim embeddings on 23K UTKFace images predict 98% gender (SVM), 94% race (KNN) and 5.8 age MAPE (LGBM); a bias-aware LangChain agent turns predicted demographics into tailored product recommendations, deployed as a containerized Streamlit app on Hugging Face. Repo: github.com/Prithwijit24/product_recommendation_with_agent.`,

  `Project — Credit Card Fraud Detection (Jan 2026 – Mar 2026, ongoing): A scalable real-time fraud detection platform with streaming ML inference, explainable risk scoring and low-latency transaction monitoring, with production deployment using Docker, Kubernetes and FastAPI. Repo: github.com/Prithwijit24/credit_card_fraud_detection.`,

  `Project — Agentic Travel Planner: An LLM agent that plans end-to-end trips (itineraries, budgets, routes) using external tools. A LangGraph hub delegates to route, budget and timing workers with retrieval-augmented (RAG) context. Repo: github.com/Prithwijit24/agentic_travel_planner.`,

  `Project — Music Recommendation System: Personalized recommendations from listening patterns and audio/content features. A hybrid recommender blends collaborative filtering with content-based audio features and embedding-based similarity for next-track and playlist suggestions. Repo: github.com/Prithwijit24/music_recommendation.`,

  `Education: M.Sc. in Statistics, Indian Institute of Technology (IIT) Kanpur, 2021–2023 — CGPA 8.9, JAM All India Rank 7, Department Rank 6. B.Sc. in Statistics, Bidhannagar College, Kolkata, 2018–2021 — CGPA 9.99, Department Rank 1.`,

  `Certifications & badges: Machine Learning Specialization (Stanford), Data Analysis with R Programming (Google), Python for Data Science (IBM), Mathematics for Machine Learning: Linear Algebra (Imperial College London), ML to DL for Remote Sensing (ISRO), Data Visualization with Tableau (Great Learning). Credly badges: IBM Applied Data Science with Python — Level 2, IBM Data Analysis Using Python, Microsoft AI Skills Fest 2026.`,

  `Key achievements: JAM Statistics All India Rank 7; 97–99% accuracy on 24-month multi-country forecasts; 90% due-month AUC on late-payment risk; worked across 7+ client projects plus Accenture internal projects; reduced overdue amounts by 38%; increased collections by 12% over two years after go-live.`,

  `Hobbies & interests: Travel, painting, and reading mathematics / books. Outside data pipelines, Prithwijit explores AI agents, contributes to open-source ML projects, and follows the latest in MLOps and LLM research.`,

  `Contact: email ghoshprithwijit39@gmail.com, phone +91-7595986858 / +91-9230358950, GitHub github.com/Prithwijit24, LinkedIn linkedin.com/in/prithwijit-ghosh-datascience. Open to data science roles, collaborations, forecasting systems, MLOps and analytics problems.`,

  // HR / behavioral interview Q&A so the bot answers common HR questions consistently.
  ...HR_QA
];

let kbVectors: number[][] | null = null;

let embTurn = 0;
async function embedOne(text: string, taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'): Promise<number[]> {
  const ks = geminiKeys();
  if (!ks.length) throw new Error('no-embed-key');
  const start = embTurn++ % ks.length;
  let lastErr: unknown;
  for (let i = 0; i < ks.length; i++) {
    const key = ks[(start + i) % ks.length];
    try {
      const res = await fetch(`${BASE}/models/${EMB_MODEL}:embedContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: `models/${EMB_MODEL}`, content: { parts: [{ text }] }, taskType })
      });
      if (!res.ok) throw new Error(`embed ${res.status}`);
      const data = await res.json();
      return data.embedding.values as number[];
    } catch (e) { lastErr = e; }
  }
  throw lastErr ?? new Error('embed-failed');
}

const embed = (texts: string[], taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY') =>
  Promise.all(texts.map((t) => embedOne(t, taskType)));

// Embed the KB in sequential batches so a large knowledge base doesn't fire
// 100+ concurrent embedding calls on cold start (which can trip rate limits).
async function embedDocs(texts: string[], batchSize = 16): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    out.push(...await embed(texts.slice(i, i + batchSize), 'RETRIEVAL_DOCUMENT'));
  }
  return out;
}

// Lexical fallback when embeddings are unavailable (e.g. all Gemini keys rate-limited).
const keywordRetrieve = (query: string, k: number): string[] => {
  const terms = [...new Set(query.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2))];
  return KB
    .map((text) => { const lt = text.toLowerCase(); return { text, score: terms.reduce((s, t) => s + (lt.includes(t) ? 1 : 0), 0) }; })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((r) => r.text);
};

const cosine = (a: number[], b: number[]) => {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
};

const SYSTEM = `You are the AI clone of Prithwijit Ghosh, a data scientist. You answer questions from someone interviewing or curious about Prithwijit.
Rules:
- Answer in the first person ("I", "my") as Prithwijit.
- Use ONLY the facts in the provided context. Do not invent numbers, employers, dates or projects.
- If the context does not contain the answer, say you don't have that detail and suggest what you can talk about (experience, projects, skills, research, education).
- Be concise and natural — 2 to 4 sentences. No markdown headers.`;

async function genGemini(key: string, model: string, system: string, user: string): Promise<string> {
  const res = await fetch(`${BASE}/models/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ parts: [{ text: user }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 320 }
    })
  });
  if (!res.ok) throw new Error(`gemini ${res.status}`);
  const d = await res.json();
  return (d?.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
}

async function genOpenAICompatible(url: string, key: string, model: string, system: string, user: string): Promise<string> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, temperature: 0.3, max_tokens: 320, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] })
  });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  const d = await res.json();
  return (d?.choices?.[0]?.message?.content ?? '').trim();
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OR_URL = 'https://openrouter.ai/api/v1/chat/completions';
const LLM7_URL = 'https://api.llm7.io/v1/chat/completions';

type Attempt = { via: string; run: () => Promise<string> };

// Rotate across Gemini models (each has its own quota) to spread load, then
// fail over to Groq, then OpenRouter. Any error (429 included) -> next attempt.
let geminiTurn = 0;
async function generate(system: string, user: string): Promise<{ text: string; via: string }> {
  const gem: Attempt[] = [];
  for (const k of geminiKeys()) for (const m of GEMINI_MODELS) gem.push({ via: `gemini:${m}`, run: () => genGemini(k, m, system, user) });
  const start = gem.length ? geminiTurn++ % gem.length : 0;
  const ordered: Attempt[] = gem.map((_, i) => gem[(start + i) % gem.length]);
  for (const k of groqKeys()) for (const m of GROQ_MODELS) ordered.push({ via: `groq:${m}`, run: () => genOpenAICompatible(GROQ_URL, k, m, system, user) });
  for (const k of llm7Keys()) for (const m of LLM7_MODELS) ordered.push({ via: `llm7:${m}`, run: () => genOpenAICompatible(LLM7_URL, k, m, system, user) });
  for (const k of openrouterKeys()) for (const m of OPENROUTER_MODELS) ordered.push({ via: `openrouter:${m}`, run: () => genOpenAICompatible(OR_URL, k, m, system, user) });
  if (!ordered.length) throw new Error('no-generation-providers');
  let lastErr: unknown;
  for (const a of ordered) {
    try { const t = await a.run(); if (t) return { text: t, via: a.via }; } catch (e) { lastErr = e; }
  }
  throw lastErr ?? new Error('all-providers-failed');
}

export async function ragAnswer(query: string, debug = false): Promise<{ answer?: string; error?: string; via?: string }> {
  const q = (query || '').trim();
  if (!q) return { error: 'Please type a question first.' };
  if (!hasAnyKey()) return { error: 'The chatbot is not configured yet (no API keys set).' };

  // retrieve context — semantic embeddings, with a lexical fallback if those are rate-limited
  let context: string;
  try {
    if (!kbVectors) kbVectors = await embedDocs(KB);
    const [qv] = await embed([q], 'RETRIEVAL_QUERY');
    context = KB.map((text, i) => ({ text, score: cosine(qv, kbVectors![i]) }))
      .sort((a, b) => b.score - a.score).slice(0, 5).map((r) => r.text).join('\n\n---\n\n');
  } catch {
    context = keywordRetrieve(q, 6).join('\n\n---\n\n');
  }

  try {
    const { text, via } = await generate(SYSTEM, `CONTEXT:\n${context}\n\nQUESTION: ${q}`);
    return debug ? { answer: text || '(empty)', via } : { answer: text || "Sorry, I couldn't come up with an answer to that." };
  } catch {
    return { error: 'My AI clone is briefly over its free quota across all providers — please try again in a moment.' };
  }
}
