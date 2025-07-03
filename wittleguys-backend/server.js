// Wittleguys Stripe Backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCT_MAPPING = {
  // 'productId': 'price_xxx',
  // Fill with your product IDs and Stripe price IDs
};

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid items' });
    const line_items = items.map(item => ({
      price: item.price,
      quantity: item.quantity
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });
    res.json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`)); 