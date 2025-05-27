const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { log } = require('../utils/logger');

const router = express.Router();

// For demo purposes, we'll use in-memory user storage
// In production, this would use your MongoDB/Prisma setup
const demoUsers = [
  {
    id: 'demo-user-1',
    email: 'phdai@abdallamalik.com',
    password: '$2b$10$K7Z7rJ9ZBQ8s3vR5TqNhJO8VQrT8YXm1XhJ4K2L8Z7s3VR5TqNhJO', // hashed '1234567ASD'
    createdAt: new Date('2024-01-01')
  }
];

// Initialize demo user password
const initializeDemoUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash('1234567ASD', 10);
    demoUsers[0].password = hashedPassword;
    log('🔐 Demo user credentials initialized');
  } catch (error) {
    log(`❌ Failed to initialize demo user: ${error.message}`, 'error');
  }
};

// Initialize on startup
initializeDemoUser();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    log(`🔐 Login attempt for: ${email}`);

    // Find user (in demo mode, just check our demo user)
    const user = demoUsers.find(u => u.email === email);

    if (!user) {
      log(`❌ User not found: ${email}`, 'warn');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      log(`❌ Invalid password for: ${email}`, 'warn');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const jwtSecret = config.jwtSecret || 'demo-secret-key-for-development';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      jwtSecret,
      { expiresIn: config.jwtExpiration || '1d' }
    );

    log(`✅ User logged in successfully: ${user.email}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    log(`❌ Login error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Login failed' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwtSecret = config.jwtSecret || 'demo-secret-key-for-development';
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Protected route example
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = demoUsers.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    log(`❌ Profile fetch error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Token validation endpoint
router.post('/validate', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      userId: req.user.userId,
      email: req.user.email
    }
  });
});

// Logout endpoint (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  log(`👋 User logged out: ${req.user.email}`);
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;