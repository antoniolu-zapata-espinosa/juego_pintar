import { list } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: 'dibujos/' });
    blobs.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(blobs.map(b => ({ url: b.url })));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
