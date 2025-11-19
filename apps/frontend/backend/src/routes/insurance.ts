import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { pool } from '../config/database';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// POST /api/v1/insurance/claim
router.post(
  '/claim',
  [
    body('scan_id').isUUID().withMessage('Valid scan_id required'),
    body('claim_amount').optional().isFloat({ min: 0 }),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { scan_id, claim_amount } = req.body;

      // Verify scan belongs to user
      const scanResult = await pool.query(
        'SELECT id, health_score, disease_label FROM scans WHERE id = $1 AND user_id = $2',
        [scan_id, req.userId]
      );

      if (scanResult.rows.length === 0) {
        return res.status(404).json({ error: 'Scan not found' });
      }

      const scan = scanResult.rows[0];
      const wheatHealthScore = scan.health_score;

      // Calculate claim amount if not provided (mock calculation)
      const calculatedAmount = claim_amount || (wheatHealthScore < 50 ? 50000 : 25000);

      // Create claim
      const claimId = uuidv4();

      // TODO: Blockchain verification - store hash
      const blockchainTxHash = `0x${Buffer.from(claimId).toString('hex').padStart(64, '0')}`;

      await pool.query(
        `INSERT INTO claims (id, user_id, scan_id, wheat_health_score, claim_amount, status, blockchain_tx_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          claimId,
          req.userId,
          scan_id,
          wheatHealthScore,
          calculatedAmount,
          'pending',
          blockchainTxHash,
        ]
      );

      res.status(201).json({
        id: claimId,
        scanId: scan_id,
        wheatHealthScore,
        claimAmount: calculatedAmount,
        status: 'pending',
        blockchainTxHash,
        message: 'Claim submitted successfully',
      });
    } catch (error) {
      console.error('Create claim error:', error);
      res.status(500).json({ error: 'Failed to create claim' });
    }
  }
);

// GET /api/v1/insurance/status/:claimId
router.get('/status/:claimId', async (req: AuthRequest, res) => {
  try {
    const { claimId } = req.params;

    const result = await pool.query(
      `SELECT c.*, s.disease_label, s.image_url 
       FROM claims c 
       JOIN scans s ON c.scan_id = s.id 
       WHERE c.id = $1 AND c.user_id = $2`,
      [claimId, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get claim status error:', error);
    res.status(500).json({ error: 'Failed to get claim status' });
  }
});

// GET /api/v1/insurance/claims (admin/expert only)
router.get('/claims', requireRole('admin', 'expert'), async (req: AuthRequest, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT c.*, u.name as user_name, s.disease_label 
      FROM claims c 
      JOIN users u ON c.user_id = u.id 
      LEFT JOIN scans s ON c.scan_id = s.id 
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND c.status = $${paramCount++}`;
      params.push(status);
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({ claims: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('List claims error:', error);
    res.status(500).json({ error: 'Failed to list claims' });
  }
});

export default router;


