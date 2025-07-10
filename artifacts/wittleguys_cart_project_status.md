# Wittle Guys E-commerce Redesign & Fixes — Project Status (as of July 2025)

## **Current Status**
- Site is live and functional, but requires major design and UX improvements for both mobile and desktop.
- Checkout and contact form are working, but some branding and layout issues persist.
- Deployment workflow: All changes are made in Cursor IDE, pushed to GitHub, pulled to Arch machine, built with Hugo, and deployed to VPS via rsync. Backend is managed with PM2.

## **Outstanding Tasks**

### **Mobile**
- [ ] Header background should be black for readability.
- [ ] Logo (caterpillar) is too large; needs to be smaller and centered.
- [ ] All content is off-centered; must be centered.
- [ ] Remove background image; use white background (like vanman.shop).
- [ ] Add a fixed black menu bar at the bottom (like vanman.shop). Tapping expands menu with: Home, All Products, Blog, Our Vision, Contact Us, and a red X to close.

### **Desktop**
- [ ] Center all content. Title ('wittle guys!!') is too far right and too small.
- [ ] Logo is too big and too far right; needs to be smaller and centered. Nav tabs should move right.
- [ ] Cart notification badge is not centered in its circle.
- [ ] Add a top thin banner: "FREE USA SHIPPING ON ORDERS OVER $100" (multi-colored, animated ticker, as thin as vanman.shop).

### **Site Structure**
- [ ] Top banner, then logo (centered, smaller), cart to far right.
- [ ] Below logo: nav tabs ('Home', 'All Products', 'Our Vision', 'Blog', 'Contact Us').
- [ ] 'All Products' is a separate page: title, subtitle ("More Coming Soon"), and product list with prices.
- [ ] Landscape background using `cottagecore webpg.png` (adjust for mobile/desktop).
- [ ] Below landscape: all products with image, title, price. Clicking product = product page.
- [ ] Footer: black, matches vanman.shop, with email signup, social links, card logos, and copyright.
- [ ] Remove duplicate copyright.

### **Functionality**
- [ ] Checkout page says 'Pay Logan Miller' — should say 'Wittle Guys'.
- [ ] Credit card images not displaying; need to add and reference them.
- [ ] Add a reviews/testimonials section (static for now, like vanman.shop).

### **Testing & Deployment**
- [ ] Ensure all changes do not break checkout or contact form.
- [ ] Build with: `HUGO_PARAMS_STRIPE_LIVEPUBLISHABLEKEY=pk_live_... hugo`
- [ ] Deploy with: `rsync -avz --delete public/ root@wittleguys.net:/var/www/wittleguys.net/`
- [ ] Restart backend if needed: `pm2 restart wittleguys-backend --update-env && pm2 save`

### **Testing Mobile Locally**
- Use browser device emulators (Chrome DevTools, Firefox Responsive Design Mode).
- For more realism, use BrowserStack or Sauce Labs (free trials available).

### **Reference Codebases**
- No public repo for vanman.shop or kommandostore.com. Use browser dev tools to inspect their HTML/CSS.
- For open-source Hugo e-commerce themes, see:
  - https://themes.gohugo.io/tags/e-commerce/
  - https://github.com/StefMa/hugo-shop-theme
  - https://github.com/hugoplates/hugoplate (for layout ideas)

## **Notes**
- Last time, site broke due to misconfigured backgrounds/titles and checkout issues. All changes must be tested locally before deploying.
- All images for card logos should be placed in `static/images/cards/` and referenced in the footer template.
- Stripe business name should be updated in the Stripe dashboard and/or in the backend code that creates the checkout session.

---

**This artifact can be shared with Claude or any collaborator for a full overview of the project’s current state and requirements.** 