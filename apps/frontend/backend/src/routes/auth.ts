import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Generate OTP (mock - in production, send via Twilio)
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/v1/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid phone number required'),
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['farmer', 'expert']).withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, phone, email, password, role = 'farmer', language = 'en' } = req.body;

      // Check if user exists
      const existing = await pool.query(
        'SELECT id FROM users WHERE phone = $1 OR email = $2',
        [phone, email]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (id, name, phone, email, password_hash, role, language)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, phone, email, role, language`,
        [uuidv4(), name, phone, email || null, passwordHash, role, language]
      );

      const user = result.rows[0];

      // Generate tokens
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: { ...user, password_hash: undefined },
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// POST /api/v1/auth/login
router.post(
  '/login',
  [
    body('phone').optional().trim(),
    body('email').optional().trim(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone, email, password } = req.body;

      if (!phone && !email) {
        return res.status(400).json({ error: 'Phone or email required' });
      }

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE (phone = $1 OR email = $2)',
        [phone || null, email || null]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Verify password
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // Store refresh token
      await pool.query(
        'INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES ($1, $2, $3, $4)',
        [uuidv4(), user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          language: user.language,
        },
        token,
        refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// POST /api/v1/auth/otp
router.post(
  '/otp',
  [
    body('phone').trim().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid phone number required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone } = req.body;
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP
      await pool.query(
        'INSERT INTO otps (id, phone, code, expires_at) VALUES ($1, $2, $3, $4)',
        [uuidv4(), phone, code, expiresAt]
      );

      // TODO: Send OTP via Twilio (demo mode - log it)
      if (process.env.TWILIO_ACCOUNT_SID) {
        // Real Twilio integration would go here
        console.log(`[DEMO] OTP for ${phone}: ${code}`);
      } else {
        console.log(`[DEMO MODE] OTP for ${phone}: ${code}`);
      }

      res.json({ message: 'OTP sent successfully', expiresIn: 600 });
    } catch (error) {
      console.error('OTP error:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  }
);

// GET /api/v1/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, phone, email, role, language, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;


