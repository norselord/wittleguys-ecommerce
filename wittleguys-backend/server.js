// Wittleguys Stripe Backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');

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

    const cancelUrl = `${process.env.FRONTEND_URL}/`;
    console.log('Stripe cancel_url:', cancelUrl);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (typeof message !== 'string' || message.length < 10 || message.length > 2000) {
    return res.status(400).json({ error: 'Message must be between 10 and 2000 characters.' });
  }
  try {
    // Configure Nodemailer with SMTP2GO relay
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g. 'mail.smtp2go.com'
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    await transporter.sendMail({
      from: `Wittleguys Contact <support@wittleguys.net>` ,
      to: 'support@wittleguys.net',
      subject: `Contact Form Submission from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}</p><p>${message.replace(/\n/g, '<br>')}</p>`
    });
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`)); 