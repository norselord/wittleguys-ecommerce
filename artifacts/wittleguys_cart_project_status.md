# Wittleguys Ecommerce Project Status Artifact

## Workflow Overview
- **Windows Desktop:**
  - Main workstation for AI (Claude, Cursor IDE), code editing, and GitHub commits.
- **Arch Linux Laptop:**
  - Development/testing (via RDP from Windows), running Hugo server for local testing.
- **Vultr VPS (Debian):**
  - Production hosting with Nginx, ready for rsync deployment.
- **Deployment:**
  - Use `rsync` to push updated site and backend to the VPS.

---

## Completed
- **Converted HTML prototype to Hugo templates.**
- **Modern, minimal design (Inter font, seafoam green theme).**
- **Product grid, cart, and Stripe checkout implemented.**
- **Responsive site with custom logo, favicon, and background image.**
- **Product pages clickable, show full-size images and descriptions.**
- **Cart supports add/remove, live updates, and quantity adjustment.**
- **Navigation includes dropdown for product categories.**
- **Footer has social links and playful copyright.**
- **Bloat removed: unused archetypes, themes, images, and sample content.**
- **About page and footer customized.**
- **Product markdown files updated with images and Stripe price IDs.**
- **Stripe integration:**
  - Products created in Stripe test mode, correct price IDs copied.
  - Publishable key added to `config.toml`.
  - Node.js backend for secure Stripe Checkout session creation.
  - Nginx config for proxying `/api/` to backend.
  - Cart.js and templates updated for server-side Stripe integration.
- **Cart UI:**
  - Off-canvas drawer, overlay, recommendations panel, discount code input, trash can remove icon, quantity controls, and modern cart icon.
  - Cart persists in localStorage.
- **Recommendations logic:**
  - JS array of all products injected into page.
  - Cart.js logic to show up to 3 recommended products.

---

## Outstanding / Needs Fixing
- **Hand Embroidered Dress price displays as $1.20 instead of $120 in cart.**
  - Markdown front matter is set to `price: 120`, but cart still shows $1.20. Likely a parsing or data type issue in cart.js or in the ALL_PRODUCTS array.
- **Recommendations panel not displaying any products.**
  - ALL_PRODUCTS array is present, but renderRecommendations() does not show items. Possible data mismatch or logic bug.
- **Recommended panel logic may need to be more robust (e.g., always show 3 products, even if in cart).**
- **Discount code input is present but not functional.**
- **Stripe cancel_url should be checked to ensure it points to a real page.**
- **Final production deployment and live Stripe mode not yet completed.**
- **Further UI/UX tweaks as desired.**

---

## Key Context for Next Steps
- **Frontend:** Hugo static site, custom JS for cart, recommendations, and Stripe integration.
- **Backend:** Node.js Express server for Stripe Checkout session creation, running on port 3001, proxied by Nginx.
- **Product data:** Markdown files in `content/products/`, each with image, price, and Stripe price ID.
- **Cart:** Off-canvas drawer, localStorage persistence, quantity controls, trash can remove, recommendations panel.
- **Recommendations:** JS array of all products injected via Hugo template, logic in cart.js to display up to 3 products.
- **Testing:** Local dev on Arch Linux, production on Vultr VPS, deployment via rsync.

---

## For Next Conversation
- Fix dress price display in cart.
- Fix recommendations panel to always show products.
- Finalize discount code logic and Stripe cancel_url.
- Prepare for production deployment and live payments.
- Any further UI/UX or feature requests. 