# Cursor Git Sync Fix - Push Contact Endpoint to GitHub

## Problem Summary
- Your local `server.js` file contains the `/api/contact` endpoint
- GitHub repository is missing this endpoint
- VPS pulls from GitHub, so it's also missing the endpoint
- Need to push local changes to GitHub and redeploy

## Step 1: Verify Current Status in Cursor Terminal

Open terminal in Cursor and run these commands:

```bash
# Check current git status
git status

# Check if there are any uncommitted changes
git diff

# Check current branch
git branch

# Check remote origin
git remote -v
```

## Step 2: Stage and Commit Changes

```bash
# Stage the server.js file with the contact endpoint
git add server.js

# Check if package.json needs to be updated (if nodemailer was added)
npm list nodemailer
# If nodemailer is missing, install it:
npm install nodemailer

# If package.json was updated, stage it too
git add package.json

# Commit with descriptive message
git commit -m "Add /api/contact endpoint with SMTP2GO email functionality

- Implements contact form submission
- Sends emails to support@wittleguys.net
- Sends confirmation emails to users
- Includes spam prevention and rate limiting
- Validates email format and message length (3333 char limit)"
```

## Step 3: Push to GitHub

```bash
# Push to main branch
git push origin main

# If you get any errors, force push (only if you're sure about the changes)
# git push -f origin main
```

## Step 4: Verify on GitHub

1. Go to: `https://github.com/norselord/wittleguys-ecommerce`
2. Check that your latest commit appears
3. Click on `server.js` file
4. Verify the `/api/contact` endpoint is present (should be around lines 48-150)
5. Check that the commit message shows your contact endpoint changes

## Step 5: Deploy to VPS

After confirming the code is on GitHub, SSH to your VPS and run:

```bash
cd /opt/wittleguys-backend

# Pull the latest changes
git pull origin main

# Install any new dependencies
npm install

# Restart the backend service
pm2 restart wittleguys-backend

# Verify the endpoint exists
grep -n "api/contact" server.js

# Test the endpoint locally
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","subject":"Test","message":"Test message"}'
```

## Step 6: Update Environment Variables

Make sure your VPS `.env` file includes these SMTP settings:

```bash
# Edit the .env file
nano /opt/wittleguys-backend/.env

# Add these lines (rep