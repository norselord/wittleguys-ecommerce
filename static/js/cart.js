// Wittleguys Cart.js - Real Cart with Stripe Checkout
// Assumes window.STRIPE_PUBLISHABLE_KEY and window.BACKEND_URL are set in the template

const CART_KEY = 'wittleguys_cart';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function addToCart(productId, name, price, priceId) {
  if (!cart[productId]) {
    cart[productId] = { name, price, priceId, quantity: 1 };
  } else {
    cart[productId].quantity += 1;
  }
  saveCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
}

function updateQuantity(productId, delta) {
  if (cart[productId]) {
    cart[productId].quantity += delta;
    if (cart[productId].quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
    }
  }
}

function renderCart() {
  const cartEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!cartEl || !totalEl) return;
  cartEl.innerHTML = '';
  let total = 0;
  Object.entries(cart).forEach(([id, item]) => {
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <span>${item.name}</span>
      <span>$${(item.price / 100).toFixed(2)}</span>
      <button onclick="updateQuantity('${id}', -1)">-</button>
      <span>${item.quantity}</span>
      <button onclick="updateQuantity('${id}', 1)">+</button>
      <button onclick="removeFromCart('${id}')">Remove</button>
    `;
    cartEl.appendChild(row);
    total += item.price * item.quantity;
  });
  totalEl.textContent = `$${(total / 100).toFixed(2)}`;
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.renderCart = renderCart;

document.addEventListener('DOMContentLoaded', renderCart);

document.getElementById('checkout-btn')?.addEventListener('click', async () => {
  const items = Object.values(cart).map(item => ({
    price: item.priceId,
    quantity: item.quantity
  }));
  if (items.length === 0) return alert('Cart is empty!');
  const res = await fetch(`${window.BACKEND_URL}/api/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  if (!res.ok) return alert('Checkout failed.');
  const { sessionId } = await res.json();
  const stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);
  stripe.redirectToCheckout({ sessionId });
});
