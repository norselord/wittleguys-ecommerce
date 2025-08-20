# WittleGuys Newsletter & Contact Form Backend

A Flask-based backend service for handling newsletter subscriptions and contact form submissions for your Hugo website.

## Features

- **Newsletter Subscriptions**: Collect and manage email subscribers
- **Contact Form Handling**: Process contact form submissions with auto-replies
- **Email Notifications**: Automatic emails to subscribers and support team
- **Spam Protection**: Honeypot fields and rate limiting
- **Admin Interface**: Export subscribers and contacts as CSV
- **Bulk Newsletter Sending**: Send newsletters to all subscribers
- **Production Ready**: Systemd service, nginx reverse proxy, security headers

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Hugo Website  │───▶│  Flask Backend   │───▶│  SQLite DB      │
│                 │    │  (Port 5000)     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   SMTP Relay     │
                       │  (Email Service) │
                       └──────────────────┘
```

## Quick Start

### 1. Local Development

```bash
# Clone the repository
cd wittleguys-newsletter

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export SMTP_SERVER=your-smtp-server.com
export SMTP_PORT=587
export SMTP_USER=your-smtp-username
export SMTP_PASS=your-smtp-password
export SECRET_KEY=your-secret-key
export ADMIN_TOKEN=your-admin-token

# Run the application
python app.py
```

### 2. Production Deployment

```bash
# On your VPS, run the deployment script
chmod +x deploy.sh
sudo ./deploy.sh

# Edit environment variables
sudo nano /opt/wittleguys-newsletter/.env

# Start the service
sudo systemctl start wittleguys-newsletter
sudo systemctl reload nginx
```

## API Endpoints

### Newsletter Subscription
- **POST** `/subscribe`
- **Body**: `{"email": "user@example.com"}`
- **Response**: `{"success": true, "message": "Subscription successful"}`

### Contact Form
- **POST** `/contact`
- **Body**: `{"name": "John Doe", "email": "john@example.com", "message": "Hello!"}`
- **Response**: `{"success": true, "message": "Message sent successfully"}`

### Health Check
- **GET** `/health`
- **Response**: `{"status": "healthy", "timestamp": "2024-01-01T00:00:00"}`

### Admin Endpoints
- **GET** `/admin/subscribers` - Export subscribers as CSV
- **GET** `/admin/contacts` - Export contacts as CSV
- **GET** `/admin/stats` - Get basic statistics

*Note: Admin endpoints require `Authorization: Bearer <ADMIN_TOKEN>` header*

## Email Flow

### Newsletter Subscription
1. User submits email via Hugo form
2. Backend validates email and checks for duplicates
3. Email stored in SQLite database
4. Confirmation email sent FROM `updates@wittleguys.net`
5. Notification email sent TO `support@wittleguys.net`

### Contact Form
1. User submits contact form via Hugo
2. Form data stored in SQLite database
3. Auto-reply sent TO sender FROM `support@wittleguys.net`
4. Full message forwarded TO `support@wittleguys.net`

## Database Schema

### Subscribers Table
```sql
CREATE TABLE subscribers (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME NOT NULL
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL
);
```

## Hugo Integration

### Newsletter Form
```html
<form id="newsletter-form" class="newsletter-form">
    <!-- Honeypot field -->
    <input type="text" name="website" style="display: none;" tabindex="-1" autocomplete="off">
    
    <div class="form-group">
        <label for="newsletter-email">Email Address</label>
        <input type="email" id="newsletter-email" name="email" required>
    </div>
    
    <button type="submit" class="btn btn-primary">Subscribe</button>
</form>
```

### Contact Form
```html
<form id="contact-form" class="contact-form">
    <!-- Honeypot field -->
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
```

See `hugo-forms-examples.md` for complete integration examples.

## Bulk Newsletter Sending

Send newsletters to all subscribers using the `newsletter_send.py` script:

```bash
# Test run (no emails sent)
python newsletter_send.py --dry-run

# Send with custom subject
python newsletter_send.py --subject "New Products Available!"

# Send with custom HTML and text files
python newsletter_send.py --html-file newsletter.html --text-file newsletter.txt

# Use custom database path
python newsletter_send.py --db-path /path/to/subscribers.db
```

## Security Features

- **Honeypot Fields**: Hidden form fields to catch bots
- **Rate Limiting**: nginx rate limiting (10/min for newsletter, 5/min for contact)
- **Input Validation**: Email format validation and required field checks
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **XSS Protection**: Security headers in nginx configuration
- **CSRF Protection**: Form validation and proper HTTP methods

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SMTP_SERVER` | SMTP server hostname | Required |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | Required |
| `SMTP_PASS` | SMTP password | Required |
| `SECRET_KEY` | Flask secret key | Auto-generated |
| `ADMIN_TOKEN` | Admin API token | Auto-generated |
| `NEWSLETTER_FROM_EMAIL` | Newsletter sender email | updates@wittleguys.net |

## Monitoring & Logs

### Service Status
```bash
# Check service status
sudo systemctl status wittleguys-newsletter

# View service logs
sudo journalctl -u wittleguys-newsletter -f

# View nginx logs
sudo tail -f /var/log/nginx/newsletter_access.log
sudo tail -f /var/log/nginx/newsletter_error.log
```

### Health Checks
```bash
# Test health endpoint
curl https://api.wittleguys.net/health

# Test newsletter endpoint
curl -X POST https://api.wittleguys.net/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Troubleshooting

### Common Issues

1. **Service won't start**
   - Check logs: `journalctl -u wittleguys-newsletter -f`
   - Verify environment variables in `.env` file
   - Check Python dependencies: `pip list`

2. **Emails not sending**
   - Verify SMTP credentials in `.env`
   - Check SMTP server connectivity
   - Review application logs for error messages

3. **Database errors**
   - Ensure SQLite database is writable
   - Check file permissions: `ls -la /opt/wittleguys-newsletter/`
   - Recreate database: `python3 -c "from app import app, db; db.create_all()"`

4. **Nginx issues**
   - Test configuration: `nginx -t`
   - Check nginx logs: `tail -f /var/log/nginx/error.log`
   - Verify SSL certificates are valid

### Performance Tuning

- **Database**: Consider using PostgreSQL for high-traffic sites
- **Caching**: Add Redis for session storage and caching
- **Workers**: Adjust Gunicorn workers based on CPU cores
- **Rate Limiting**: Modify nginx rate limits as needed

## Development

### Adding New Features

1. **New Endpoints**: Add routes in `app.py`
2. **Database Models**: Extend `models.py`
3. **Email Templates**: Modify email content in route handlers
4. **Validation**: Add validation functions as needed

### Testing

```bash
# Run basic tests
python -c "
from app import app
with app.test_client() as client:
    response = client.get('/health')
    print(f'Health check: {response.status_code}')
"

# Test database operations
python -c "
from app import app, db, Subscriber
with app.app_context():
    sub = Subscriber(email='test@example.com')
    db.session.add(sub)
    db.session.commit()
    print('Test subscriber added')
"
```

## License

This project is part of the WittleGuys e-commerce platform.

## Support

For issues and questions:
- Check the logs and troubleshooting section
- Review the Hugo integration examples
- Ensure all environment variables are properly set
- Verify SMTP server connectivity and credentials
