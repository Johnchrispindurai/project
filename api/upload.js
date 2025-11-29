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
    console.log('Received image size bytes:', buffer.length);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify({ message: 'Photo uploaded successfully', size: buffer.length }));
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ message: 'Server error' });
  }
}