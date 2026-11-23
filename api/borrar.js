import { del } from '@vercel/blob';
import { PASSWORD } from './_config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const want = String(PASSWORD || process.env.ADMIN_PASSWORD || '').trim();
  if (!want) return res.status(503).json({ error: 'sin_config' });
  const got = String((req.body && req.body.pw) || '').trim();
  if (got !== want) return res.status(401).json({ error: 'contraseña' });
  try {
    const url = (req.body && req.body.url) || '';
    if (!url.includes('.blob.vercel-storage.com/dibujos/')) return res.status(400).json({ error: 'url' });
    await del(url);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
