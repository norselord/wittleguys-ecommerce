#!/usr/bin/env python3
"""
Bulk newsletter sending script for WittleGuys
Reads subscribers from database and sends newsletter emails with rate limiting
"""

import os
import sys
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import sqlite3
import argparse
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class NewsletterSender:
    def __init__(self, db_path, smtp_config):
        self.db_path = db_path
        self.smtp_config = smtp_config
        self.rate_limit_delay = 1  # seconds between emails
        
    def get_subscribers(self):
        """Get all subscribers from database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT email FROM subscribers ORDER BY created_at")
            subscribers = [row[0] for row in cursor.fetchall()]
            conn.close()
            return subscribers
        except Exception as e:
            logger.error(f"Failed to get subscribers: {e}")
            return []
    
    def send_newsletter(self, to_email, subject, html_content, text_content):
        """Send a single newsletter email"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.smtp_config['from_email']
            msg['To'] = to_email
            
            # Add both HTML and text versions
            text_part = MIMEText(text_content, 'plain')
            html_part = MIMEText(html_content, 'html')
            msg.attach(text_part)
            msg.attach(html_part)
            
            # Connect to SMTP server
            with smtplib.SMTP(self.smtp_config['server'], self.smtp_config['port']) as server:
                server.starttls()
                server.login(self.smtp_config['username'], self.smtp_config['password'])
                server.send_message(msg)
            
            logger.info(f"Newsletter sent to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send newsletter to {to_email}: {e}")
            return False
    
    def send_bulk_newsletter(self, subject, html_content, text_content, dry_run=False):
        """Send newsletter to all subscribers"""
        subscribers = self.get_subscribers()
        
        if not subscribers:
            logger.warning("No subscribers found")
            return
        
        logger.info(f"Found {len(subscribers)} subscribers")
        
        if dry_run:
            logger.info("DRY RUN MODE - No emails will be sent")
            logger.info(f"Would send to: {', '.join(subscribers[:5])}{'...' if len(subscribers) > 5 else ''}")
            return
        
        success_count = 0
        failed_count = 0
        
        for i, email in enumerate(subscribers, 1):
            logger.info(f"Processing {i}/{len(subscribers)}: {email}")
            
            if self.send_newsletter(email, subject, html_content, text_content):
                success_count += 1
            else:
                failed_count += 1
            
            # Rate limiting
            if i < len(subscribers):  # Don't delay after the last email
                time.sleep(self.rate_limit_delay)
        
        logger.info(f"Newsletter campaign completed:")
        logger.info(f"  Success: {success_count}")
        logger.info(f"  Failed: {failed_count}")
        logger.info(f"  Total: {len(subscribers)}")

def load_smtp_config():
    """Load SMTP configuration from environment variables"""
    config = {
        'server': os.environ.get('SMTP_SERVER'),
        'port': int(os.environ.get('SMTP_PORT', 587)),
        'username': os.environ.get('SMTP_USER'),
        'password': os.environ.get('SMTP_PASS'),
        'from_email': os.environ.get('NEWSLETTER_FROM_EMAIL', 'updates@wittleguys.net')
    }
    
    # Validate required fields
    required_fields = ['server', 'username', 'password']
    missing_fields = [field for field in required_fields if not config[field]]
    
    if missing_fields:
        logger.error(f"Missing required SMTP configuration: {missing_fields}")
        logger.error("Please set the following environment variables:")
        logger.error("  SMTP_SERVER, SMTP_USER, SMTP_PASS")
        sys.exit(1)
    
    return config

def create_sample_newsletter():
    """Create a sample newsletter template"""
    html_content = """
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                <h1 style="color: #333;">WittleGuys Newsletter</h1>
                <p style="color: #666;">Stay updated with our latest news and products!</p>
            </div>
            
            <div style="padding: 20px;">
                <h2>What's New This Month</h2>
                <p>We're excited to share some updates with you!</p>
                
                <h3>New Products</h3>
                <p>Check out our latest handcrafted items in the shop.</p>
                
                <h3>Upcoming Events</h3>
                <p>Mark your calendar for our upcoming craft fairs and workshops.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://wittleguys.net/shop" 
                       style="background-color: #007bff; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Visit Our Shop
                    </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #666; font-size: 14px;">
                    You're receiving this email because you subscribed to our newsletter.<br>
                    <a href="#" style="color: #007bff;">Unsubscribe</a> | 
                    <a href="https://wittleguys.net" style="color: #007bff;">Visit Website</a>
                </p>
            </div>
        </body>
    </html>
    """
    
    text_content = """
    WittleGuys Newsletter
    
    What's New This Month
    
    We're excited to share some updates with you!
    
    New Products
    Check out our latest handcrafted items in the shop.
    
    Upcoming Events
    Mark your calendar for our upcoming craft fairs and workshops.
    
    Visit Our Shop: https://wittleguys.net/shop
    
    ---
    You're receiving this email because you subscribed to our newsletter.
    Visit our website: https://wittleguys.net
    """
    
    return html_content, text_content

def main():
    parser = argparse.ArgumentParser(description='Send bulk newsletter to subscribers')
    parser.add_argument('--subject', default='WittleGuys Newsletter', help='Email subject')
    parser.add_argument('--html-file', help='Path to HTML content file')
    parser.add_argument('--text-file', help='Path to text content file')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be sent without sending')
    parser.add_argument('--db-path', default='subscribers.db', help='Path to SQLite database')
    
    args = parser.parse_args()
    
    # Load SMTP configuration
    try:
        smtp_config = load_smtp_config()
    except Exception as e:
        logger.error(f"Failed to load SMTP configuration: {e}")
        sys.exit(1)
    
    # Load content
    if args.html_file and args.text_file:
        try:
            with open(args.html_file, 'r', encoding='utf-8') as f:
                html_content = f.read()
            with open(args.text_file, 'r', encoding='utf-8') as f:
                text_content = f.read()
        except Exception as e:
            logger.error(f"Failed to read content files: {e}")
            sys.exit(1)
    else:
        # Use sample newsletter
        html_content, text_content = create_sample_newsletter()
        logger.info("Using sample newsletter template")
    
    # Initialize sender
    sender = NewsletterSender(args.db_path, smtp_config)
    
    # Send newsletter
    try:
        sender.send_bulk_newsletter(
            args.subject,
            html_content,
            text_content,
            dry_run=args.dry_run
        )
    except KeyboardInterrupt:
        logger.info("Newsletter sending interrupted by user")
    except Exception as e:
        logger.error(f"Failed to send newsletter: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
