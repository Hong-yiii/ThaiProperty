import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM_URL = 'https://web-production-c3a7d.up.railway.app/forecast';

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
    console.error('Forecast proxy error:', error);
    res.status(500).json({ error: error.message || 'Forecast proxy failed' });
  }
} 