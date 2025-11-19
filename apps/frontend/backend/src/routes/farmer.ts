import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/farmer/profile
router.get('/profile', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, phone, email, role, language, created_at 
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get farms
    const farmsResult = await pool.query(
      'SELECT * FROM farms WHERE user_id = $1',
      [req.userId]
    );

    res.json({
      user: result.rows[0],
      farms: farmsResult.rows,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// PATCH /api/v1/farmer/profile
router.patch(
  '/profile',
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('language').optional().isIn(['en', 'hi', 'mr', 'te']),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, language } = req.body;
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (name) {
        updates.push(`name = $${paramCount++}`);
        values.push(name);
      }
      if (email) {
        updates.push(`email = $${paramCount++}`);
        values.push(email);
      }
      if (language) {
        updates.push(`language = $${paramCount++}`);
        values.push(language);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(req.userId);
      const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, name, phone, email, role, language`;

      const result = await pool.query(query, values);

      res.json({ message: 'Profile updated', user: result.rows[0] });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

export default router;


