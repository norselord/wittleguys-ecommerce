# Wittleguys Stripe Cart Debug Artifact

## Project Overview
- **Site:** Hugo static site for wittleguys.net
- **Goal:** Real shopping cart with Stripe Checkout (multiple items, quantities)
- **Stack:** Hugo (static), Node.js backend for Stripe, Stripe.js frontend

---

## Backend Setup
- **Directory:** `wittleguys-backend/`
- **Files:**
  - `server.js` (Express server, POST /api/create-checkout-session)
  - `package.json` (express, stripe, cors, dotenv)
  - `.env` (contains STRIPE_SECRET_KEY, FRONTEND_URL, PORT)
  - `.gitignore` (ignores .env, node_modules)
- **Status:**
  - Backend runs and `/api/health` returns `{"status":"ok"}`
  - Stripe secret key and frontend URL set in `.env`

---

## Frontend Setup
- **Cart JS:** Only `static/js/cart.js` remains (old `assets/js/cart.js` deleted)
- **cart.js:**
  - Uses localStorage for cart
  - Exposes `addToCart` etc. on `window`
  - On checkout, POSTs cart to `/api/create-checkout-session` and redirects to Stripe with `sessionId`
- **Product buttons:** Should call `addToCart('id', 'name', price, 'priceId')`

---

## Template Changes
- **File:** `layouts/_default/baseof.html`
- **Key changes:**
  - Removed Hugo asset pipeline for JS
  - Only loads `/js/cart.js` from static
  - Injects Stripe publishable key and backend URL via:
    ```html
    <script>
      window.STRIPE_PUBLISHABLE_KEY = "pk_test_...";
      window.BACKEND_URL = "http://localhost:3001";
    </script>
    <script src="/js/cart.js"></script>
    ```

---

## Deleted/Obsolete Files
- `assets/js/cart.js` (old, client-only Stripe integration)

---

## Current Issues/Symptoms
- **Cannot add anything to cart** (clicking Add to Cart does nothing)
- **Checkout does not work**
- No visible JS errors in Console (or errors not yet reported)
- `addToCart` may not be available globally or not called by product buttons
- Unsure if product buttons have correct `onclick` or data attributes
- Unsure if `cart.js` is loaded and correct version

---

## Key Code Snippets
### Example cart.js (static/js/cart.js)
```js
window.addToCart = addToCart;
// ...
document.getElementById('checkout-btn')?.addEventListener('click', async () => {
  // ...
});
```

### Example template block
```html
<script>
  window.STRIPE_PUBLISHABLE_KEY = "pk_test_...";
  window.BACKEND_URL = "http://localhost:3001";
</script>
<script src="/js/cart.js"></script>
```

### Example product button
```html
<button onclick="addToCart('vintage-bag', 'Vintage Hand Sewn Bag', 6500, 'price_1Nxxxxxxx')">Add to Cart</button>
```

---

## What Needs Fixing
- Ensure `addToCart` is globally available and called by product buttons
- Ensure `cart.js` is loaded and correct
- Ensure checkout POSTs to backend and receives valid sessionId
- Debug any JS errors or missing handlers
- Confirm product button HTML and event wiring

---

## Additional Context
- All changes committed and pushed to GitHub
- Testing locally with `hugo server` and backend on port 3001
- Stripe test keys in use

---

## Request
- Fix cart so items can be added
- Fix checkout so it works with backend session creation
- Ensure all event handlers and scripts are wired up correctly 