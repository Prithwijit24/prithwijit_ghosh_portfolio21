# Prithwijit Ghosh — Portfolio

A polished, single-page portfolio for a data scientist, built with React 19 + Vite + TypeScript. It features animated SVG/canvas data-science visualizations and an **"Interview Me" chatbot** — a RAG pipeline grounded in the résumé and this site's content, with multi-provider failover so it rarely hits a rate limit.

## Tech stack

- **React 19** + **TypeScript 6** + **Vite 8** (HMR, `vite build`)
- Hand-rolled **SVG / canvas** visualizations (no chart library)
- **Serverless RAG chatbot** — `/api` function on Vercel, mirrored in dev via a Vite middleware

## Features

- **Sections** — Hero, About, Professional Experience, Portfolio Projects, Skills & Expertise, Master's Research, Certifications & Badges, Hobbies, Contact.
- **Visualizations** — an animated 4D tesseract for the Master's research, a workflow pipeline for experience, per-project architecture diagrams, and a depth-depth (DD) classifier plot.
- **Performance-minded** — canvas animation loops are gated by `IntersectionObserver`, event handlers are `requestAnimationFrame`-coalesced, and everything respects `prefers-reduced-motion` so it runs on low-end devices.
- **Interview Me chatbot** — ask questions about the experience/projects and get answers grounded in real facts (no hallucinated numbers); out-of-scope questions are politely declined.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your API keys (see below)
npm run dev            # http://localhost:5173
```

Other scripts:

```bash
npm run build     # tsc -b && vite build
npm run preview   # serve the production build
npm run lint      # eslint
```

## The "Interview Me" chatbot (RAG)

The chatbot answers questions from a knowledge base built out of the résumé and portfolio content.

**Pipeline:** KB passages → embeddings (Gemini `gemini-embedding-001`) → cosine top-k retrieval → grounded, first-person generation. A lexical keyword search is used as a fallback when embeddings are unavailable.

**Multi-provider routing & failover** — to avoid rate limits, generation tries providers in order, failing over on any error (including `429`):

1. **Google Gemini** — multiple models × keys (each model has its own quota)
2. **Groq** — Llama 3.x models
3. **llm7.io** — free `default` auto-routed model
4. **OpenRouter** — free models

Set `debug: true` in the request body to see which provider/model served (`via` field).

### Environment variables

Add these to `.env` for local dev, and to your Vercel project's **Environment Variables** for production. Every provider is optional — the chatbot uses whichever keys are present — but at least one is required.

| Variable | Provider | Get a key |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini (embeddings + generation) | https://aistudio.google.com/apikey |
| `GROQ_API_KEY` | Groq | https://console.groq.com/keys |
| `LLM7IO_API_KEY` | llm7.io | https://token.llm7.io |
| `OPENROUTER_API_KEY` | OpenRouter | https://openrouter.ai/keys |

Multiple keys per provider are supported (comma-separated, or `*_API_KEY_2`, `*_API_KEY_3`, …) and are rotated round-robin.

> **Note:** keys live server-side only and are never exposed to the browser. Keep `.env` out of git (it's already in `.gitignore`).

## Project structure

```
api/
  _rag.ts       # RAG core: knowledge base, embeddings, retrieval, multi-provider routing
  chat.ts       # Vercel serverless handler: POST /api/chat { query } -> { answer }
src/
  main.tsx      # app entry
  data.ts       # all résumé/portfolio content (experience, projects, skills, etc.)
  theme.ts      # accent palette
  style.css     # styles
  sections/     # page sections (Hero, MscProject, Certifications, …)
  components/   # visualizations, chatbot modal, nav, primitives
vite.config.ts  # React plugin + dev middleware that serves /api/chat locally
```

## Deployment

Deployed to **Vercel** via the existing CI/CD on push. The `/api/chat` function runs as a Vercel serverless function in production; in local dev the same module is served through a Vite middleware, so behavior matches.
