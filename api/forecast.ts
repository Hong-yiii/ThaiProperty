import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM_URL = 'https://web-production-c3a7d.up.railway.app/forecast';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const upstreamResp = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
    });

    const text = await upstreamResp.text();
    let payload: any;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: text };
    }

    res.status(upstreamResp.status).json(payload);
  } catch (error: any) {
    console.error('Forecast proxy error:', error);
    res.status(500).json({ error: error.message || 'Forecast proxy failed' });
  }
} 