# Wittleguys Ecommerce Project: Bootstrap Context Artifact

## Workflow & Environment
- **Development OS:**
  - **Arch Linux laptop** (main dev machine, runs Hugo server for local testing)
  - Accessed via **RDP** from a **Windows desktop**
- **Windows Desktop:**
  - Used for AI/code assistance (Claude, Cursor IDE)
  - Code editing, GitHub commits
- **Production Hosting:**
  - **Vultr VPS** running **Debian**
  - Nginx serves the static site and proxies API requests to backend
- **Deployment:**
  - Use `rsync` to push updated static site and backend code from Arch laptop to the Debian VPS

## Tech Stack
- **Frontend:** Hugo static site generator, custom HTML/CSS/JS
- **Backend:** Node.js Express server (for Stripe Checkout), runs on port 3001, proxied by Nginx
- **Payments:** Stripe (test mode for now, live mode for production)
- **Cart:** Off-canvas drawer, localStorage persistence, add/remove/quantity controls, modern UI
- **Product Data:** Markdown files in `content/products/` with image, price, Stripe price ID

## Completed Work
- Converted HTML prototype to Hugo templates (modern, minimal, responsive design)
- Product grid, cart, and Stripe checkout implemented
- Product pages clickable, show images/descriptions
- Cart supports add/remove, quantity controls, trash can remove, localStorage persistence
- Navigation with dropdowns for categories; custom logo, favicon, background image
- Footer with social links and playful copyright
- Product markdown files updated with images and Stripe price IDs
- Stripe integration: products created in Stripe test mode, correct price IDs used
- Publishable key added to config
- Node.js backend for secure Stripe Checkout session creation
- Nginx config updated to proxy `/api/` to backend
- Cart.js and templates updated for server-side Stripe integration
- Cart UI/UX: off-canvas drawer, overlay, discount code input (UI only), modern cart icon
- Cart initialization and validation logic fixed (always array, robust against corruption)
- Price display bug fixed (all prices now show correctly in dollars)
- Recommendations panel removed (per user request)

## Outstanding Tasks / Next Steps
- **Testing:**
  - Conduct end-to-end testing of the checkout flow (add to cart, checkout, Stripe test payment, success/cancel pages)
  - Verify cart persistence, UI/UX, and error handling
  - Test deployment to production VPS and confirm site works as expected
- **Discount Code Logic:**
  - UI is present, but discount code logic is not implemented (optionally integrate with Stripe Coupons)
- **Stripe Live Mode:**
  - Switch Stripe keys and products to live mode for production
  - Double-check `success_url` and `cancel_url` in backend for correct routing
- **Final UI/UX Tweaks:**
  - Any further design or usability improvements as desired
- **Production Deployment:**
  - Use `rsync` to deploy static site and backend to Vultr VPS
  - Restart backend server and reload Nginx as needed
- **Documentation:**
  - Update README and deployment instructions if needed

## Key Context for Next Developer/Claude
- **All major cart and checkout bugs are fixed.**
- **Recommendations panel has been removed.**
- **Discount code is UI only (no backend logic yet).**
- **Testing and production deployment are the next priorities.**
- **Stripe is in test mode; ready to switch to live when confirmed.**
- **Workflow is cross-platform: dev on Arch, AI/code on Windows, deploy to Debian VPS.**
- **Use rsync for deployment.**
- **Nginx proxies /api/ to backend on port 3001.**
- **All product data is in Hugo markdown files.**

## What Claude Should Help With Next
- Guide through full end-to-end testing of the checkout and payment flow
- Help implement discount code logic (if desired)
- Assist with switching Stripe to live mode and verifying all URLs
- Advise on production deployment and post-launch checks
- Answer any further UI/UX or feature requests

---

**This artifact contains everything needed to understand the current state, workflow, and next steps for the Wittleguys ecommerce project.** 