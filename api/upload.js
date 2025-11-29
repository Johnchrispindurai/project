import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN not configured');
      return res.status(500).json({ message: 'Storage not configured' });
    }
    
    const blob = await put(`photo-${Date.now()}.jpg`, buffer, {
      access: 'public',
      contentType: 'image/jpeg',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    console.log('Saved image URL:', blob.url);
    
    return res.status(200).json({ message: 'saved', url: blob.url });
  } catch (e) {
    console.error('Upload error:', e.message, e.stack);
    return res.status(500).json({ message: 'Server error: ' + e.message });
  }
}