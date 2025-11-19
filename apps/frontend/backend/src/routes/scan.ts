import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FormData from 'form-data';
import { authenticate, AuthRequest } from '../middleware/auth';
import { scanRateLimiter } from '../middleware/rateLimiter';
import { pool } from '../config/database';
import { minioClient, BUCKET_NAME } from '../config/storage';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All routes require authentication
router.use(authenticate);

// POST /api/v1/scan
router.post(
  '/',
  scanRateLimiter,
  upload.single('image'),
  [
    body('farm_id').optional().isUUID(),
    body('geo').optional().isObject(),
    body('language').optional().isIn(['en', 'hi', 'mr', 'te']),
    body('voice_note').optional().isString(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Image file required' });
      }

      const { farm_id, geo, language = 'en', voice_note } = req.body;

      // Upload image to MinIO
      const fileName = `scans/${req.userId}/${uuidv4()}-${req.file.originalname}`;
      await minioClient.putObject(BUCKET_NAME, fileName, req.file.buffer, {
        'Content-Type': req.file.mimetype,
      });

      const imageUrl = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${fileName}`;

      // Call ML service
      const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
      let mlResult;
      try {
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });

        const mlResponse = await axios.post(`${mlServiceUrl}/infer`, formData, {
          headers: formData.getHeaders(),
        });
        mlResult = mlResponse.data;
      } catch (mlError) {
        console.error('ML service error:', mlError);
        // Fallback to mock result
        mlResult = {
          disease: 'Unknown',
          confidence: 0.5,
        };
      }

      // Calculate health score (mock - in production, use ML model output)
      const healthScore = mlResult.disease === 'Healthy' 
        ? 85 + Math.floor(Math.random() * 15)
        : 30 + Math.floor(Math.random() * 50);

      // Store scan in database
      const scanId = uuidv4();
      const metadata = {
        geo: geo ? JSON.parse(geo) : null,
        language,
        voice_note: voice_note || null,
        treatment: `Recommended treatment for ${mlResult.disease}`,
      };

      await pool.query(
        `INSERT INTO scans (id, user_id, farm_id, image_url, disease_label, confidence, health_score, metadata, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          scanId,
          req.userId,
          farm_id || null,
          imageUrl,
          mlResult.disease,
          mlResult.confidence,
          healthScore,
          JSON.stringify(metadata),
          'completed',
        ]
      );

      // Update farm's last_scan_at if farm_id provided
      if (farm_id) {
        await pool.query(
          'UPDATE farms SET last_scan_at = CURRENT_TIMESTAMP WHERE id = $1',
          [farm_id]
        );
      }

      res.status(201).json({
        id: scanId,
        disease: mlResult.disease,
        confidence: mlResult.confidence,
        healthScore,
        imageUrl,
        metadata,
        treatment: metadata.treatment,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Scan error:', error);
      res.status(500).json({ error: 'Scan processing failed' });
    }
  }
);

// GET /api/v1/scan/:id
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT s.*, u.name as user_name 
       FROM scans s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.id = $1 AND (s.user_id = $2 OR $3 = 'admin' OR $3 = 'expert')`,
      [id, req.userId, req.userRole]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    const scan = result.rows[0];
    scan.metadata = typeof scan.metadata === 'string' 
      ? JSON.parse(scan.metadata) 
      : scan.metadata;

    res.json(scan);
  } catch (error) {
    console.error('Get scan error:', error);
    res.status(500).json({ error: 'Failed to get scan' });
  }
});

// GET /api/v1/scan (list user's scans)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT s.*, f.name as farm_name 
       FROM scans s 
       LEFT JOIN farms f ON s.farm_id = f.id 
       WHERE s.user_id = $1 
       ORDER BY s.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.userId, limit, offset]
    );

    const scans = result.rows.map(scan => ({
      ...scan,
      metadata: typeof scan.metadata === 'string' 
        ? JSON.parse(scan.metadata) 
        : scan.metadata,
    }));

    res.json({ scans, count: scans.length });
  } catch (error) {
    console.error('List scans error:', error);
    res.status(500).json({ error: 'Failed to list scans' });
  }
});

export default router;

