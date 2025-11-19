import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// POST /api/v1/orders
router.post(
  '/',
  [
    body('items').isArray().withMessage('Items array required'),
    body('items.*.product_id').isUUID().withMessage('Valid product_id required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shipping_address').optional().isObject(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { items, shipping_address } = req.body;

      // Validate products and calculate total
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        const productResult = await pool.query(
          'SELECT id, name, price, quantity FROM products WHERE id = $1',
          [item.product_id]
        );

        if (productResult.rows.length === 0) {
          return res.status(400).json({ error: `Product ${item.product_id} not found` });
        }

        const product = productResult.rows[0];
        if (product.quantity < item.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for ${product.name}` 
          });
        }

        validatedItems.push({
          product_id: product.id,
          product_name: product.name,
          quantity: item.quantity,
          price: parseFloat(product.price),
        });

        totalAmount += parseFloat(product.price) * item.quantity;
      }

      // Create order
      const orderId = uuidv4();
      await pool.query(
        `INSERT INTO orders (id, user_id, items, total_amount, status, shipping_address)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          req.userId,
          JSON.stringify(validatedItems),
          totalAmount,
          'pending',
          shipping_address ? JSON.stringify(shipping_address) : null,
        ]
      );

      // TODO: Integrate Razorpay for payment
      // For now, return order with payment_id placeholder
      const paymentId = process.env.RAZORPAY_KEY_ID 
        ? 'razorpay_order_placeholder' 
        : 'demo_payment_id';

      res.status(201).json({
        id: orderId,
        items: validatedItems,
        totalAmount,
        status: 'pending',
        paymentId,
        message: 'Order created. Proceed to payment.',
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
);

// GET /api/v1/orders
router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    const orders = result.rows.map(order => ({
      ...order,
      items: typeof order.items === 'string' 
        ? JSON.parse(order.items) 
        : order.items,
      shipping_address: typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address,
    }));

    res.json({ orders, count: orders.length });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

export default router;


