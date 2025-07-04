# Wittleguys Cart Recommendations Panel Issue Artifact

## Problem
- The recommendations panel in the cart drawer (“Recommended for you”) is not visible on the site, even though the HTML and JS logic are present and correct.

## Expected Behavior
- When the cart drawer is open (desktop), a panel on the left should show up to 3 recommended products not currently in the cart (or fill with others if fewer than 3 remain).

## Current State
- The HTML for the recommendations panel exists in `layouts/_default/baseof.html`:
  ```html
  <div class="cart-recommendations">
    <h4>Recommended for you</h4>
    <div id="cart-recommend-list"></div>
  </div>
  ```
- The JS (`static/js/cart.js`) correctly populates `#cart-recommend-list` using the `window.ALL_PRODUCTS` array.
- The recommendations logic is called when the cart drawer is shown.

## Root Cause
- The recommendations panel is hidden by a global CSS rule in `assets/css/main.css`:
  ```css
  .cart-recommendations { display: none; }
  ```
- There is also a mobile-specific rule (which is correct):
  ```css
  @media (max-width: 700px) {
    .cart-recommendations { display: none; }
  }
  ```
- The global rule prevents the panel from ever being visible, even on desktop.

## How to Fix
1. **Open** `assets/css/main.css`.
2. **Find and remove or comment out** the line:
   ```css
   .cart-recommendations { display: none; }
   ```
   (Leave the mobile media query rule as-is.)
3. **Save the file** and rebuild/reload the site.
4. **Hard refresh** the browser to clear cached CSS.

## Other Context
- The recommendations panel is inside the cart drawer, which is a flex container.
- The JS expects the container to be present and visible to inject recommendations.
- The rest of the cart and recommendations logic is working and does not need changes.

## Symptoms if Not Fixed
- No recommendations panel is visible, even though products are being selected in JS.
- No errors in the console; just missing UI.

---

**Summary for Claude:**  
The recommendations panel is hidden by a global CSS rule. Remove `.cart-recommendations { display: none; }` from `assets/css/main.css` (except inside the mobile media query) to make the panel visible on desktop. No JS or HTML changes are needed. 