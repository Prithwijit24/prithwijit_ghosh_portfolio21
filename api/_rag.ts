// Chatbot for the "Interview Me" feature.
// Knowledge base = Prithwijit Ghosh's résumé + portfolio + HR Q&A, chunked.
//
// Retrieval: lexical (keyword) search — instant, zero API calls, no cold-start
// timeout on Vercel. For a focused 120-chunk KB this is plenty accurate.
//
// Generation fails over (round-robin) across providers:
//   Gemini (5 models × N keys) → Groq → llm7.io → OpenRouter
// Configure via env (any subset; comma-separate for multiple keys):
//   GEMINI_API_KEY / GEMINI_API_KEYS / GEMINI_API_KEY_2 / GEMINI_API_KEY_3
//   GROQ_API_KEY / GROQ_API_KEYS          (free: https://console.groq.com)
//   OPENROUTER_API_KEY / OPENROUTER_API_KEYS  (free: https://openrouter.ai)

import { RESUME_KB } from './_rag_resume.js';

declare const process: { env: Record<string, string | undefined> };

const BASE = 'https://generativelanguage.googleapis.com/v1beta';
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
/* Source of truth: auto-extracted from the latest resume PDF in public/resumes/.
   Regenerate with: npm run extract-resume (or npm run build / npm run dev).      */
const KB: string[] = [
  ...RESUME_KB
];

// Lexical retrieval over the knowledge base.
// Fast, no API calls — avoids cold-start timeout on Vercel (10s Hobby limit).
const retrieve = (query: string, k: number): string[] => {
  const terms = [...new Set(query.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2))];
  return KB
    .map((text) => { const lt = text.toLowerCase(); return { text, score: terms.reduce((s, t) => s + (lt.includes(t) ? 1 : 0), 0) }; })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((r) => r.text);
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

  // retrieve context via lexical search (instant, no API calls — avoids Vercel timeout)
  const context = retrieve(q, 6).join('\n\n---\n\n');

  try {
    const { text, via } = await generate(SYSTEM, `CONTEXT:\n${context}\n\nQUESTION: ${q}`);
    return debug ? { answer: text || '(empty)', via } : { answer: text || "Sorry, I couldn't come up with an answer to that." };
  } catch {
    return { error: 'My AI clone is briefly over its free quota across all providers — please try again in a moment.' };
  }
}
