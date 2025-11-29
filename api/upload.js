import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    const blob = await put(`photo-${Date.now()}.jpg`, buffer, {
      access: 'public',
      contentType: 'image/jpeg',
    });
    
    console.log('Saved image URL:', blob.url);
    
    res.status(200).json({ message: 'saved', url: blob.url });
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ message: 'Server error' });
  }
}