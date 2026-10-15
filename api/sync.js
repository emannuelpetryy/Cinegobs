import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const BLOB_PATH = 'cinevault-cloud-state.json';
  const token = (process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_LlTNOMAlXDqoXggO_g6huUMpE42A2QpyJ4UUzoygwngX4mY').replace(/["']/g, '').trim();

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: BLOB_PATH, token });
      if (blobs && blobs.length > 0) {
        const latestBlob = blobs[0];
        const response = await fetch(latestBlob.url, { cache: 'no-store' });
        const data = await response.json();
        return res.status(200).json({ status: 'ok', data, updatedAt: latestBlob.uploadedAt });
      } else {
        return res.status(200).json({ status: 'empty' });
      }
    } catch (err) {
      console.error('Blob GET error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const jsonContent = typeof body === 'string' ? body : JSON.stringify(body);
      const blob = await put(BLOB_PATH, jsonContent, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
        token
      });
      return res.status(200).json({ status: 'ok', url: blob.url });
    } catch (err) {
      console.error('Blob POST error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
