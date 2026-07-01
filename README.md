# Prithwijit Ghosh — Portfolio

A single-page portfolio for a data scientist, built with **React 19** + **Vite 8** + **TypeScript 6**. Features hand-rolled SVG/canvas visualizations, an animated hypercube renderer, and an **"Interview Me" chatbot** — a RAG pipeline grounded in the résumé with multi-provider LLM failover.

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 19, TypeScript 6 |
| Build | Vite 8, `@vitejs/plugin-react` |
| Lint | ESLint 10, typescript-eslint |
| Chatbot API | Vercel serverless (`api/_rag.ts`) |
| Visualizations | Hand-rolled SVG + Canvas (no chart library) |
| Testing | Playwright (screenshots) |

## Features

- **9 sections** — Hero (with animated network viz), Professional Experience (animated pipeline), Portfolio Projects (per-project architecture SVGs), Skills & Expertise, Master's Research (4D hypercube), Certifications & Badges (gold medal frame), Hobbies, Contact
- **Interview Me chatbot** — RAG pipeline with grounded QA; multi-provider failover (Gemini → Groq → llm7.io → OpenRouter) so it rarely hits a rate limit
- **Performance** — canvas animation loops gated by `IntersectionObserver`, event handlers `requestAnimationFrame`-coalesced, respects `prefers-reduced-motion`
- **Responsive** — mobile/tablet/desktop breakpoints; desktop uses `rem`-based layout so browser Ctrl+/Ctrl- zoom scales the whole page proportionally
- **Cursor glow** — decorative mouse follower that respects reduced motion

## Getting Started

```bash
npm install
cp .env.example .env   # fill in at least one API key
npm run dev            # http://localhost:5173
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (HMR) |
| `npm run build` | `tsc -b && vite build` |
| `npm run preview` | Serve production build |
| `npm run lint` | ESLint check |
| `npm run og-image` | Generate OG preview screenshot |

## Project Structure

```
api/
  _rag.ts        # RAG core: KB, embeddings, retrieval, multi-provider routing
  _hr.ts         # HR-specific RAG tools
  chat.ts        # Vercel serverless handler: POST /api/chat
src/
  main.tsx       # App entry — all 9 sections rendered in order
  data.ts        # Portfolio content (experience, projects, skills, achievements)
  theme.ts       # 5-colour spring accent palette
  style.css      # All styling (~1355 lines, single file)
  sections/
    Hero.tsx           # Animated network intro
    MscProject.tsx     # 4D hypercube viz
    Certifications.tsx # Badge grid + medal frame
  components/
    SiteNav.tsx             # Responsive nav bar
    SceneFx.tsx             # Hero network animation (canvas)
    ExperienceViz.tsx       # Workflow pipeline SVG
    ProjectArch.tsx         # Per-project architecture diagrams
    MscViz.tsx              # Hypercube + DD-plot canvases
    InterviewChatModal.tsx  # Chatbot modal UI
    primitives.tsx          # FadeIn, SectionHeading, AnimatedCounter, TiltCard, SkillBar
    decorations.tsx         # CursorGlow, ScrollProgress, BackToTop, SectionCorners
    SectionShell.tsx        # Blend-transition section wrapper
    Icons.tsx               # GitHub, LinkedIn, Gmail, Download SVGs
vite.config.ts    # React plugin + dev chat API proxy + HTML env injection
index.html        # Entry HTML with inline loader, OG/Twitter meta, Google Fonts
```

## The "Interview Me" Chatbot (RAG)

The chatbot answers questions from a knowledge base built from the résumé and portfolio content.

**Pipeline:** KB passages → embeddings (Gemini `gemini-embedding-001`) → cosine top-k retrieval → grounded, first-person generation. A lexical keyword fallback catches cases where embeddings are unavailable.

**Multi-provider failover** (tries providers in order, skips on any error):

1. **Gemini** — multiple models × keys (round-robin per model)
2. **Groq** — Llama 3.x models
3. **llm7.io** — free auto-routed model
4. **OpenRouter** — free models

Set `debug: true` in the request body to see which provider/model served (`via` field).

### Environment Variables

Add these to `.env` for local dev and to your Vercel project for production. At least one provider key is required.

| Variable | Provider |
|---|---|
| `GEMINI_API_KEY` | Google Gemini (embeddings + generation) |
| `GROQ_API_KEY` | Groq |
| `LLM7IO_API_KEY` | llm7.io |
| `OPENROUTER_API_KEY` | OpenRouter |

Multiple keys per provider are supported (comma-separated, or numbered `*_API_KEY_2`, `*_API_KEY_3`, …) and rotated round-robin.

> Keys live server-side only and are never exposed to the browser. `.env` is gitignored.

## Browser Zoom

Desktop layout uses `rem`-based values, so **Ctrl+** and **Ctrl-** (browser zoom) scales the entire page proportionally — text, sections, spacing, and visualizations all shrink/grow together. Mobile and tablet views use viewport-relative units and are unaffected.

## Deployment

Deployed to **Vercel**. The `/api/chat` function runs as a serverless function in production; in local dev the same module is served through a Vite middleware, so behaviour is identical.

Push to `main` to trigger the CI/CD pipeline.

## License

MIT — see [LICENSE](LICENSE).
