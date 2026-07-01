import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'

// Replaces %VITE_SITE_URL% in index.html with the env value at build time.
const htmlEnv = (): Plugin => ({
  name: 'html-env',
  transformIndexHtml: {
    order: 'pre',
    handler(html: string, ctx) {
      const siteUrl = ctx.server
        ? process.env.VITE_SITE_URL || 'http://localhost:4173'
        : process.env.VITE_SITE_URL || 'https://prithwijit-ghosh.vercel.app';
      return html.replace(/%VITE_SITE_URL%/g, siteUrl);
    },
  },
});

// Serves POST /api/chat during `vite dev` (mirrors the Vercel function in prod)
// by loading the shared RAG module through Vite's SSR loader.
const devChatApi = (): Plugin => ({
  name: 'dev-chat-api',
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/api/chat', (req, res, next) => {
      if (req.method !== 'POST') return next()
      let body = ''
      req.on('data', (c) => { body += c })
      req.on('end', async () => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const { query, debug } = JSON.parse(body || '{}')
          const mod = await server.ssrLoadModule('/api/_rag.ts')
          const result = await mod.ragAnswer(String(query ?? ''), debug === true)
          res.end(JSON.stringify(result))
        } catch {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Something went wrong handling your question.' }))
        }
      })
    })
  }
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // expose the chatbot's server-side API keys to the dev middleware
  const env = loadEnv(mode, process.cwd(), '')
  for (const k of [
    'GEMINI_API_KEY', 'GEMINI_API_KEYS', 'GEMINI_API_KEY_2', 'GEMINI_API_KEY_3', 'GEMINI_API_KEY_4', 'GOOGLE_API_KEY',
    'GROQ_API_KEY', 'GROQ_API_KEYS', 'GROQ_API_KEY_2',
    'OPENROUTER_API_KEY', 'OPENROUTER_API_KEYS', 'OPENROUTER_API_KEY_2',
    'LLM7IO_API_KEY', 'LLM7IO_API_KEYS', 'LLM7IO_TOKEN',
    'LLM7_API_KEY', 'LLM7_API_KEYS', 'LLM7_TOKEN', 'LLM7_API_KEY_2'
  ]) {
    if (env[k]) process.env[k] = env[k]
  }
  return {
    plugins: [react(), devChatApi(), htmlEnv()],
  }
})
