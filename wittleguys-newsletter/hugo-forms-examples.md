# Hugo Form Integration Examples

This document provides example Hugo form snippets for integrating with the Flask backend.

## Newsletter Subscription Form

### Basic HTML Form
```html
<form id="newsletter-form" class="newsletter-form">
    <!-- Honeypot field for spam protection -->
    <input type="text" name="website" style="display: none;" tabindex="-1" autocomplete="off">
    
    <div class="form-group">
        <label for="newsletter-email">Email Address</label>
        <input type="email" id="newsletter-email" name="email" required>
    </div>
    
    <button type="submit" class="btn btn-primary">Subscribe</button>
</form>

<div id="newsletter-message" class="message" style="display: none;"></div>
```

### JavaScript for Newsletter Form
```javascript
document.getElementById('newsletter-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('newsletter-message');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';
    
    try {
        const formData = new FormData(form);
        const response = await fetch('https://api.wittleguys.net/subscribe', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            messageDiv.textContent = result.message;
            messageDiv.className = 'message success';
            form.reset();
        } else {
            messageDiv.textContent = result.message;
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message error';
    } finally {
        messageDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
    }
});
```

## Contact Form

### Basic HTML Form
```html
<form id="contact-form" class="contact-form">
    <!-- Honeypot field for spam protection -->
    <input type="text" name="website" style="display: none;" tabindex="-1" autocomplete="off">
    
    <div class="form-group">
        <label for="contact-name">Name</label>
        <input type="text" id="contact-name" name="name" required>
    </div>
    
    <div class="form-group">
        <label for="contact-email">Email</label>
        <input type="email" id="contact-email" name="email" required>
    </div>
    
    <div class="form-group">
        <label for="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows="5" required></textarea>
    </div>
    
    <button type="submit" class="btn btn-primary">Send Message</button>
</form>

<div id="contact-message" class="message" style="display: none;"></div>
```

### JavaScript for Contact Form
```javascript
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('contact-message');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        const formData = new FormData(form);
        const response = await fetch('https://api.wittleguys.net/contact', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            messageDiv.textContent = result.message;
            messageDiv.className = 'message success';
            form.reset();
        } else {
            messageDiv.textContent = result.message;
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message error';
    } finally {
        messageDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});
```

## CSS Styling

### Basic Form Styles
```css
.newsletter-form,
.contact-form {
    max-width: 500px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.btn {
    background-color: #007bff;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn:hover {
    background-color: #0056b3;
}

.btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.message {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 4px;
    text-align: center;
}

.message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
```

## Hugo Shortcode Example

### Newsletter Shortcode
Create `layouts/shortcodes/newsletter.html`:
```html
<div class="newsletter-section">
    <h3>{{ .Get "title" | default "Subscribe to Our Newsletter" }}</h3>
    <p>{{ .Get "description" | default "Stay updated with our latest news and products!" }}</p>
    
    <form id="newsletter-form-{{ .Get "id" | default "default" }}" class="newsletter-form">
        <input type="text" name="website" style="display: none;" tabindex="-1" autocomplete="off">
        
        <div class="form-group">
            <label for="newsletter-email-{{ .Get "id" | default "default" }}">Email Address</label>
            <input type="email" id="newsletter-email-{{ .Get "id" | default "default" }}" name="email" required>
        </div>
        
        <button type="submit" class="btn btn-primary">Subscribe</button>
    </form>
    
    <div id="newsletter-message-{{ .Get "id" | default "default" }}" class="message" style="display: none;"></div>
</div>

<script>
document.getElementById('newsletter-form-{{ .Get "id" | default "default" }}').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('newsletter-message-{{ .Get "id" | default "default" }}');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';
    
    try {
        const formData = new FormData(form);
        const response = await fetch('https://api.wittleguys.net/subscribe', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            messageDiv.textContent = result.message;
            messageDiv.className = 'message success';
            form.reset();
        } else {
            messageDiv.textContent = result.message;
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message error';
    } finally {
        messageDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
    }
});
</script>
```

### Usage in Hugo Content
```markdown
{{< newsletter title="Stay in the Loop" description="Get updates about new products and events!" id="footer" >}}
```

## Environment Variables

Make sure to set these environment variables on your VPS:

```bash
# SMTP Configuration
export SMTP_SERVER=your-smtp-server.com
export SMTP_PORT=587
export SMTP_USER=your-smtp-username
export SMTP_PASS=your-smtp-password

# Security
export SECRET_KEY=your-secret-key-change-this
export ADMIN_TOKEN=your-admin-token-change-this

# Newsletter sender email
export NEWSLETTER_FROM_EMAIL=updates@wittleguys.net
```

## Testing

Test the endpoints locally before deploying:

```bash
# Test newsletter subscription
curl -X POST http://localhost:5000/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Test contact form
curl -X POST http://localhost:5000/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "message": "Hello!"}'

# Test health check
curl http://localhost:5000/health
```
