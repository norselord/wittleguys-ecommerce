from flask import Flask, request, jsonify, render_template_string
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from datetime import datetime
import os
import re
import logging
from werkzeug.exceptions import BadRequest

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-this')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///subscribers.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email configuration
app.config['MAIL_SERVER'] = os.environ.get('SMTP_SERVER')
app.config['MAIL_PORT'] = int(os.environ.get('SMTP_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('SMTP_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('SMTP_PASS')
app.config['MAIL_DEFAULT_SENDER'] = 'support@wittleguys.net'

# Initialize extensions
db = SQLAlchemy(app)
mail = Mail(app)

# Import models after db initialization
from models import Subscriber, Contact

def validate_email(email):
    """Basic email validation"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def is_honeypot_filled(data):
    """Check if honeypot field is filled (spam detection)"""
    return data.get('website', '').strip() != ''

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/subscribe', methods=['POST'])
def subscribe():
    """Handle newsletter subscription"""
    try:
        data = request.get_json() or request.form.to_dict()
        
        # Honeypot check
        if is_honeypot_filled(data):
            logger.warning("Honeypot field filled - potential spam")
            return jsonify({'success': True, 'message': 'Subscription successful'}), 200
        
        # Validate required fields
        email = data.get('email', '').strip()
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Check if already subscribed
        existing = Subscriber.query.filter_by(email=email).first()
        if existing:
            return jsonify({'success': False, 'message': 'Already subscribed'}), 400
        
        # Create new subscriber
        subscriber = Subscriber(email=email)
        db.session.add(subscriber)
        db.session.commit()
        
        # Send confirmation email to subscriber
        try:
            msg = Message(
                subject="Thanks for subscribing!",
                recipients=[email],
                body="You've been added to our newsletter. Stay tuned for updates!",
                html="""
                <html>
                    <body>
                        <h2>Welcome to our newsletter!</h2>
                        <p>You've been added to our newsletter. Stay tuned for updates!</p>
                        <p>Best regards,<br>The WittleGuys Team</p>
                    </body>
                </html>
                """
            )
            msg.sender = 'updates@wittleguys.net'
            mail.send(msg)
            logger.info(f"Confirmation email sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send confirmation email to {email}: {e}")
        
        # Send notification to support
        try:
            support_msg = Message(
                subject="New Newsletter Subscriber",
                recipients=['support@wittleguys.net'],
                body=f"New subscriber: {email}",
                html=f"""
                <html>
                    <body>
                        <h3>New Newsletter Subscriber</h3>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Time:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                    </body>
                </html>
                """
            )
            mail.send(support_msg)
            logger.info(f"Notification sent to support for new subscriber {email}")
        except Exception as e:
            logger.error(f"Failed to send support notification: {e}")
        
        return jsonify({'success': True, 'message': 'Subscription successful'}), 200
        
    except Exception as e:
        logger.error(f"Subscription error: {e}")
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submission"""
    try:
        data = request.get_json() or request.form.to_dict()
        
        # Honeypot check
        if is_honeypot_filled(data):
            logger.warning("Honeypot field filled - potential spam")
            return jsonify({'success': True, 'message': 'Message sent successfully'}), 200
        
        # Validate required fields
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()
        
        if not all([name, email, message]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Store contact submission
        contact = Contact(name=name, email=email, message=message)
        db.session.add(contact)
        db.session.commit()
        
        # Send auto-reply to sender
        try:
            auto_reply = Message(
                subject="We received your message",
                recipients=[email],
                body=f"Hi {name},\n\nThanks for reaching out! We'll get back to you soon.\n\nBest regards,\nThe WittleGuys Team",
                html=f"""
                <html>
                    <body>
                        <h2>Message Received</h2>
                        <p>Hi {name},</p>
                        <p>Thanks for reaching out! We'll get back to you soon.</p>
                        <p>Best regards,<br>The WittleGuys Team</p>
                    </body>
                </html>
                """
            )
            mail.send(auto_reply)
            logger.info(f"Auto-reply sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send auto-reply to {email}: {e}")
        
        # Forward message to support
        try:
            support_msg = Message(
                subject=f"New Contact Form Submission from {name}",
                recipients=['support@wittleguys.net'],
                body=f"""
                New contact form submission:
                
                Name: {name}
                Email: {email}
                Message: {message}
                
                Time: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
                """,
                html=f"""
                <html>
                    <body>
                        <h3>New Contact Form Submission</h3>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Message:</strong></p>
                        <p>{message.replace(chr(10), '<br>')}</p>
                        <p><strong>Time:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                    </body>
                </html>
                """
            )
            mail.send(support_msg)
            logger.info(f"Contact form forwarded to support from {email}")
        except Exception as e:
            logger.error(f"Failed to forward contact form to support: {e}")
        
        return jsonify({'success': True, 'message': 'Message sent successfully'}), 200
        
    except Exception as e:
        logger.error(f"Contact form error: {e}")
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/admin/subscribers', methods=['GET'])
def export_subscribers():
    """Export subscribers as CSV (admin endpoint)"""
    # Simple authentication - you might want to implement proper auth
    auth_header = request.headers.get('Authorization')
    if auth_header != f"Bearer {os.environ.get('ADMIN_TOKEN', 'your-admin-token')}":
        return jsonify({'error': 'Unauthorized'}), 401
    
    subscribers = Subscriber.query.all()
    csv_data = "email,created_at\n"
    for sub in subscribers:
        csv_data += f"{sub.email},{sub.created_at.isoformat()}\n"
    
    response = app.response_class(
        csv_data,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=subscribers.csv'}
    )
    return response

@app.route('/admin/contacts', methods=['GET'])
def export_contacts():
    """Export contacts as CSV (admin endpoint)"""
    # Simple authentication
    auth_header = request.headers.get('Authorization')
    if auth_header != f"Bearer {os.environ.get('ADMIN_TOKEN', 'your-admin-token')}":
        return jsonify({'error': 'Unauthorized'}), 401
    
    contacts = Contact.query.all()
    csv_data = "name,email,message,created_at\n"
    for contact in contacts:
        # Escape quotes in message
        message = contact.message.replace('"', '""')
        csv_data += f'"{contact.name}","{contact.email}","{message}","{contact.created_at.isoformat()}"\n'
    
    response = app.response_class(
        csv_data,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=contacts.csv'}
    )
    return response

@app.route('/admin/stats', methods=['GET'])
def get_stats():
    """Get basic statistics (admin endpoint)"""
    auth_header = request.headers.get('Authorization')
    if auth_header != f"Bearer {os.environ.get('ADMIN_TOKEN', 'your-admin-token')}":
        return jsonify({'error': 'Unauthorized'}), 401
    
    subscriber_count = Subscriber.query.count()
    contact_count = Contact.query.count()
    
    return jsonify({
        'subscribers': subscriber_count,
        'contacts': contact_count,
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        logger.info("Database tables created")
    
    app.run(host='0.0.0.0', port=5000, debug=False)
