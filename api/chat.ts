// Vercel serverless function: POST /api/chat  { query: string } -> { answer | error }
import { ragAnswer } from './_rag';

export default async function handler(req: { method?: string; body?: unknown }, res: {
  status: (n: number) => { json: (b: unknown) => void };
}) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) as { query?: string; debug?: boolean };
    const result = await ragAnswer(String(body?.query ?? ''), body?.debug === true);
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Something went wrong handling your question.' });
  }
}
