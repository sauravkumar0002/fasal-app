import express from 'express';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { pool } from '../config/database';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/analytics/heatmap
router.get('/heatmap', requireRole('admin', 'expert'), async (req: AuthRequest, res) => {
  try {
    const { from, to, disease, region } = req.query;

    let query = `
      SELECT 
        s.metadata->>'region' as region,
        s.metadata->'geo'->>'lat' as lat,
        s.metadata->'geo'->>'lng' as lng,
        s.disease_label,
        COUNT(*) as count,
        AVG(s.health_score) as avg_health_score
      FROM scans s
      WHERE s.status = 'completed'
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (from) {
      query += ` AND s.created_at >= $${paramCount++}`;
      params.push(from);
    }
    if (to) {
      query += ` AND s.created_at <= $${paramCount++}`;
      params.push(to);
    }
    if (disease) {
      query += ` AND s.disease_label = $${paramCount++}`;
      params.push(disease);
    }
    if (region) {
      query += ` AND s.metadata->>'region' = $${paramCount++}`;
      params.push(region);
    }

    query += ` GROUP BY region, lat, lng, disease_label ORDER BY count DESC`;

    const result = await pool.query(query, params);

    // Format for heatmap
    const heatmapData = result.rows.map(row => ({
      location: {
        lat: parseFloat(row.lat || '0'),
        lng: parseFloat(row.lng || '0'),
      },
      region: row.region,
      disease: row.disease_label,
      count: parseInt(row.count),
      avgHealthScore: parseFloat(row.avg_health_score || '0'),
    }));

    res.json({ heatmap: heatmapData });
  } catch (error) {
    console.error('Heatmap error:', error);
    res.status(500).json({ error: 'Failed to get heatmap data' });
  }
});

// GET /api/v1/analytics/crop-health
router.get('/crop-health', async (req: AuthRequest, res) => {
  try {
    const { region } = req.query;

    let query = `
      SELECT 
        DATE_TRUNC('week', created_at) as week,
        AVG(health_score) as avg_health,
        COUNT(*) as scan_count,
        disease_label,
        COUNT(*) FILTER (WHERE disease_label != 'Healthy') as disease_count
      FROM scans
      WHERE status = 'completed'
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (region) {
      query += ` AND metadata->>'region' = $${paramCount++}`;
      params.push(region);
    }

    query += ` GROUP BY week, disease_label ORDER BY week DESC LIMIT 12`;

    const result = await pool.query(query, params);

    res.json({ 
      timeline: result.rows.map(row => ({
        week: row.week,
        avgHealth: parseFloat(row.avg_health || '0'),
        scanCount: parseInt(row.scan_count),
        diseaseLabel: row.disease_label,
        diseaseCount: parseInt(row.disease_count || '0'),
      })),
    });
  } catch (error) {
    console.error('Crop health error:', error);
    res.status(500).json({ error: 'Failed to get crop health data' });
  }
});

export default router;


