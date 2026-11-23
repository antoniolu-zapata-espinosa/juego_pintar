import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.ADMIN_PASSWORD || req.headers['x-pw'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'contraseña' });
  }
  try {
    const data = (req.body && req.body.data) || '';
    if (!data.startsWith('data:image/png;base64,')) return res.status(400).json({ error: 'formato' });
    const buf = Buffer.from(data.split(',')[1], 'base64');
    if (buf.length > 4e6) return res.status(413).json({ error: 'grande' });
    const blob = await put('dibujos/dibujo.png', buf, {
      access: 'public', contentType: 'image/png', addRandomSuffix: true,
    });
    res.status(200).json({ url: blob.url });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
