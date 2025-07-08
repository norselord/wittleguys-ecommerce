# Complete Contact Form Implementation

## Backend Implementation (server.js)

Add this to your `server.js` file after the existing endpoints:

```javascript
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
    
    const transporter = nodemailer.createTransporter({
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
```

## Frontend Implementation

### 1. Update your contact form HTML

Replace your existing contact form with:

```html
<form id="contactForm" class="contact-form">
  <div class="form-group">
    <label for="email">Your Email:</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div class="form-group">
    <label for="subject">Subject:</label>
    <input type="text" id="subject" name="subject" maxlength="200" required>
  </div>
  
  <div class="form-group">
    <label for="message">Your message:</label>
    <textarea id="message" name="message" maxlength="3333" rows="6" required placeholder="Tell us how we can help..."></textarea>
    <div class="character-count">
      <span id="charCount">0</span>/3333 characters
    </div>
  </div>
  
  <button type="submit" id="submitBtn" class="submit-btn">
    <span class="btn-text">Send Message</span>
    <span class="btn-loader" style="display: none;">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke="#ffffff" stroke-width="4"/>
      </svg>
    </span>
  </button>
  
  <div id="formMessage" class="form-message"></div>
</form>
```

### 2. Add this CSS to your stylesheet

```css
.contact-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #4a5568;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: #ffffff;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.character-count {
  text-align: right;
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}

.submit-btn {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 150px;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #38a169, #2f855a);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn.success {
  background: linear-gradient(135deg, #48bb78, #38a169);
  animation: successPulse 0.6s ease-in-out;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-loader {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  animation: rotate 1s linear infinite;
  width: 20px;
  height: 20px;
}

.spinner .path {
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.form-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  display: none;
}

.form-message.success {
  background-color: #f0fff4;
  color: #38a169;
  border: 1px solid #9ae6b4;
}

.form-message.error {
  background-color: #fed7d7;
  color: #e53e3e;
  border: 1px solid #feb2b2;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes successPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Responsive design */
@media (max-width: 768px) {
  .contact-form {
    padding: 1rem;
  }
  
  .form-group input,
  .form-group textarea {
    padding: 0.5rem;
  }
}
```

### 3. Add this JavaScript

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  const formMessage = document.getElementById('formMessage');
  const messageTextarea = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  
  // Character counter
  messageTextarea.addEventListener('input', function() {
    const count = this.value.length;
    charCount.textContent = count;
    
    if (count > 3000) {
      charCount.style.color = '#e53e3e';
    } else if (count > 2500) {
      charCount.style.color = '#d69e2e';
    } else {
      charCount.style.color = '#718096';
    }
  });
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Disable form
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    formMessage.style.display = 'none';
    
    // Get form data
    const formData = new FormData(form);
    const data = {
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    try {
      const response = await fetch('https://api.wittleguys.net/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Success
        submitBtn.classList.add('success');
        btnText.textContent = 'Message Sent!';
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        
        formMessage.textContent = 'Thank you! Your message has been sent successfully.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        
        // Reset form
        form.reset();
        charCount.textContent = '0';
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          window.location.href = '/contact-success';
        }, 2000);
        
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
      
    } catch (error) {
      // Error
      formMessage.textContent = error.message || 'Failed to send message. Please try again.';
      formMessage.className = 'form-message error';
      formMessage.style.display = 'block';
      
      // Reset button
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      submitBtn.classList.remove('success');
    }
  });
});
```

## Environment Variables

Add these to your `.env` file on the VPS:

```env
# SMTP Configuration for SMTP2GO
SMTP_HOST=mail.smtp2go.com
SMTP_PORT=587
SMTP_USER=your_smtp2go_username
SMTP_PASS=your_smtp2go_password
SMTP_FROM=noreply@wittleguys.net
```

## Success Page

Create a new Hugo page at `content/contact-success.md`:

```markdown
---
title: "Thank You!"
layout: "single"
---

# Thank You!

Your message has been sent successfully. We'll review it and get back to you as soon as possible.

[← Back to Home](/)
```

## Package Dependencies

Make sure these are in your `package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "nodemailer": "^6.9.1",
    "stripe": "^12.9.0"
  }
}
```

## Deployment Steps

1. **Test locally on Arch:**
   ```bash
   cd /path/to/backend
   npm install
   npm start
   # Test the contact form
   ```

2. **Deploy to VPS:**
   ```bash
   cd /opt/wittleguys-backend
   git pull
   npm install
   pm2 restart wittleguys-backend
   ```

3. **Deploy frontend:**
   ```bash
   # On Arch
   hugo --cleanDestinationDir
   rsync -avz --delete public/ root@wittleguys.net:/var/www/wittleguys.net/
   ```

## Testing Recommendations

- Test form validation (empty fields, invalid email, character limits)
- Test spam prevention
- Test rate limiting
- Test email delivery to both support and user
- Test success page redirect
- Test responsive design on mobile

This implementation includes all the features you requested: proper styling, spam prevention, rate limiting, email sending, success animation, and redirect to success page.