import { del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.ADMIN_PASSWORD || req.headers['x-pw'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'contraseña' });
  }
  try {
    const url = (req.body && req.body.url) || '';
    if (!url.includes('.blob.vercel-storage.com/dibujos/')) return res.status(400).json({ error: 'url' });
    await del(url);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
