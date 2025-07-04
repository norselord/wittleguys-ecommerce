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
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid cart items' });
    }

    const lineItems = items.map(item => {
      // Use stripePriceId from frontend, or look up from mapping
      const priceId = item.stripePriceId || (PRODUCT_MAPPING[item.id] && PRODUCT_MAPPING[item.id].priceId);
      if (!priceId) throw new Error(`Missing Stripe price ID for item: ${item.id}`);
      return {
        price: priceId,
        quantity: item.quantity
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/`
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`)); 