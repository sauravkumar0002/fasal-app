import express from 'express';
import { pool } from '../config/database';

const router = express.Router();

// POST /api/v1/webhooks/twilio
router.post('/twilio', async (req, res) => {
  try {
    // TODO: Verify Twilio signature
    const { From, Body, MessageSid } = req.body;

    console.log('Twilio webhook received:', { From, Body, MessageSid });

    // Handle incoming WhatsApp/SMS messages
    // For demo, just log it
    if (process.env.TWILIO_ACCOUNT_SID) {
      // Real Twilio webhook handling would go here
      // Parse message, extract commands, respond accordingly
    }

    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// POST /api/v1/webhooks/razorpay
router.post('/razorpay', async (req, res) => {
  try {
    // TODO: Verify Razorpay signature
    const { event, payload } = req.body;

    console.log('Razorpay webhook received:', { event, payload });

    if (event === 'payment.captured') {
      const { order_id, payment_id } = payload.payment.entity;

      // Update order status
      await pool.query(
        'UPDATE orders SET status = $1, payment_id = $2 WHERE id = $3',
        ['confirmed', payment_id, order_id]
      );
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;


