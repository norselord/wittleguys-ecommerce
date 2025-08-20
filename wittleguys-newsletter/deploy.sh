#!/bin/bash

# WittleGuys Newsletter Backend Deployment Script
# Run this script on your VPS to set up the Flask backend

set -e

echo "🚀 Deploying WittleGuys Newsletter Backend..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root"
   exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "📦 Installing required packages..."
apt install -y python3 python3-pip python3-venv nginx sqlite3

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /opt/wittleguys-newsletter
cd /opt/wittleguys-newsletter

# Create virtual environment
echo "🐍 Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create database
echo "🗄️ Initializing database..."
python3 -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Database tables created successfully')
"

# Set up environment variables
echo "🔧 Setting up environment variables..."
cat > /opt/wittleguys-newsletter/.env << EOF
# SMTP Configuration
SMTP_SERVER=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password

# Security
SECRET_KEY=$(openssl rand -hex 32)
ADMIN_TOKEN=$(openssl rand -hex 32)

# Newsletter sender email
NEWSLETTER_FROM_EMAIL=updates@wittleguys.net
EOF

echo "⚠️  Please edit /opt/wittleguys-newsletter/.env with your actual SMTP credentials"

# Set up systemd service
echo "🔧 Setting up systemd service..."
cp wittleguys-newsletter.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable wittleguys-newsletter

# Set up nginx
echo "🌐 Setting up nginx..."
cp nginx-newsletter.conf /etc/nginx/sites-available/wittleguys-newsletter
ln -sf /etc/nginx/sites-available/wittleguys-newsletter /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx -t

# Set proper permissions
echo "🔐 Setting proper permissions..."
chown -R root:root /opt/wittleguys-newsletter
chmod -R 755 /opt/wittleguys-newsletter
chmod 600 /opt/wittleguys-newsletter/.env

# Create log directories
echo "📝 Creating log directories..."
mkdir -p /var/log/wittleguys-newsletter
touch /var/log/wittleguys-newsletter/app.log
chown -R root:root /var/log/wittleguys-newsletter

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit /opt/wittleguys-newsletter/.env with your SMTP credentials"
echo "2. Set up SSL certificate for api.wittleguys.net (or your preferred subdomain)"
echo "3. Start the service: systemctl start wittleguys-newsletter"
echo "4. Reload nginx: systemctl reload nginx"
echo "5. Check service status: systemctl status wittleguys-newsletter"
echo ""
echo "🔍 Useful commands:"
echo "  View logs: journalctl -u wittleguys-newsletter -f"
echo "  Restart service: systemctl restart wittleguys-newsletter"
echo "  Test endpoints: curl https://api.wittleguys.net/health"
echo ""
echo "📚 Documentation: See hugo-forms-examples.md for integration examples"
