const jwt = require('jsonwebtoken');
const JWT_SECRET = 'super-secret-key-for-assetflow';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    
    // Verify user still exists in database (handles db resets)
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!existingUser) {
      return res.status(401).json({ error: 'User no longer exists. Please log in again.' });
    }
    
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken, JWT_SECRET };
