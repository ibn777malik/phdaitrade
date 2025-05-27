export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Validate credentials here (example only)
    if (email === 'admin@example.com' && password === 'password123') {
      // Generate JWT token here or proxy to backend auth
      res.status(200).json({ token: 'fake-jwt-token' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
