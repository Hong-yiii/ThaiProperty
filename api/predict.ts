import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM_URL = 'https://realestatemodel-production.up.railway.app/predict';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const resp = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (error: any) {
    console.error('Predict proxy error:', error);
    res.status(500).json({ error: error.message || 'Predict proxy failed' });
  }
} 