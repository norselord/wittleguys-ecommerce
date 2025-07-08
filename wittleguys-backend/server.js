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
  try {
    const { email, subject, message } = req.body;
    
    // Validation
    if (!email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Character limits
    if (subject.length > 200) {
      return res.status(400).json({ error: 'Subject too long (max 200 characters)' });
    }
    
    if (message.length > 3333) {
      return res.status(400).json({ error: 'Message too long (max 3333 characters)' });
    }
    
    // Basic spam prevention
    const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'click here', 'free money'];
    const messageText = (subject + ' ' + message).toLowerCase();
    const hasSpam = spamWords.some(word => messageText.includes(word));
    
    if (hasSpam) {
      return res.status(400).json({ error: 'Message contains prohibited content' });
    }
    
    // Rate limiting (simple in-memory store - you might want Redis for production)
    const rateLimit = new Map();
    const clientIP = req.ip;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 3;
    
    if (rateLimit.has(clientIP)) {
      const requests = rateLimit.get(clientIP).filter(time => now - time < windowMs);
      if (requests.length >= maxRequests) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }
      requests.push(now);
      rateLimit.set(clientIP, requests);
    } else {
      rateLimit.set(clientIP, [now]);
    }
    
    // Email configuration (add these to your .env file)
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // Your SMTP2GO host
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    // Email to support
    const supportEmail = {
      from: process.env.SMTP_FROM || 'noreply@wittleguys.net',
      to: 'support@wittleguys.net',
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toISOString()}</small></p>
      `
    };
    
    // Confirmation email to user
    const confirmationEmail = {
      from: process.env.SMTP_FROM || 'support@wittleguys.net',
      to: email,
      subject: 'Thank you for contacting Wittle Guys!',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi there,</p>
        <p>We've received your message and will review it shortly. Our team will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p><em>${message.replace(/\n/g, '<br>')}</em></p>
        <hr>
        <p>Best regards,<br>The Wittle Guys Team</p>
        <p><small>This is an automated response. Please don't reply to this email.</small></p>
      `
    };
    
    // Send both emails
    await transporter.sendMail(supportEmail);
    await transporter.sendMail(confirmationEmail);
    
    res.json({ success: true, message: 'Message sent successfully!' });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`)); 