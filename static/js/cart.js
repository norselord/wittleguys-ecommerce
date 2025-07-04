// Wittleguys Cart - Robust Version with Validation
// Robust cart initialization - ensure it's always an array
let cart;
try {
    const storedCart = localStorage.getItem('wittleguys_cart');
    cart = storedCart ? JSON.parse(storedCart) : [];
    // Critical: Force cart to be an array if it's not
    if (!Array.isArray(cart)) {
        console.warn('Cart was not an array, converting to empty array');
        cart = [];
        localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
    }
} catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    cart = [];
    localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
}

function validateCart() {
    if (!Array.isArray(cart)) {
        console.warn('Cart corrupted, resetting to empty array');
        cart = [];
        localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
    }
    return cart;
}

function addToCart(productId, productName, productPrice, productImageOrPriceId, stripePrice) {
    validateCart();
    console.log('Adding to cart:', { productId, productName, productPrice });
    // Handle different parameter formats
    let productImage = '/images/products/default.jpg'; // Default image
    let stripePriceId = productImageOrPriceId;
    if (arguments.length === 5) {
        productImage = productImageOrPriceId;
        stripePriceId = stripePrice;
    } else if (arguments.length === 4) {
        stripePriceId = productImageOrPriceId;
    }
    // FIX: Always treat productPrice as dollars (no division)
    const price = Number(productPrice);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: productImage,
            stripePriceId: stripePriceId,
            quantity: 1
        });
    }
    localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
    updateCartUI();
    console.log('Cart after adding:', cart);
    showNotification(`${productName} added to cart!`);
}

function updateQuantity(productId, newQuantity) {
    validateCart();
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
        updateCartUI();
    }
}

function removeFromCart(productId) {
    validateCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartCount() {
    validateCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'inline-block' : 'none';
        // Randomize color on update (positive palette)
        const positivePalette = [
            '#3ec6e8', '#4ade80', '#b388ff', '#a3ffb0', '#7fdfff', '#7cfb00', '#00e6e6', '#a259e6',
            '#baffc9', '#bae1ff', '#e066ff', '#b3baff', '#b3fff6', '#c2f0fc', '#e0b3ff', '#b3ffd9',
            '#d1b3ff', '#b3e6ff', '#baffea'
        ];
        let color = positivePalette[Math.floor(Math.random() * positivePalette.length)];
        cartCountElement.style.background = color;
        cartCountElement.style.color = ['#a3ffb0','#baffc9','#bae1ff','#7cfb00','#4ade80','#b388ff','#3ec6e8','#7fdfff','#b3ffd9','#b3e6ff','#baffea','#b3fff6','#c2f0fc','#e0b3ff','#d1b3ff'].includes(color) ? '#222' : '#fff';
        cartCountElement.style.transition = 'background 0.7s, color 0.7s';
    }
}

function updateCartUI() {
    validateCart();
    updateCartCount();
    updateCartDisplay();
}

function updateCartDisplay() {
    validateCart();
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        const cartSummary = document.querySelector('.cart-summary');
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    const cartSummary = document.querySelector('.cart-summary');
    if (cartSummary) cartSummary.style.display = 'block';
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">&minus;</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <div style="color:#aef6e2;font-weight:600;">$${Number(item.price).toFixed(2)}</div>
                <button class="trash-btn" onclick="removeFromCart('${item.id}')" title="Remove">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        </div>
    `).join('');
    updateCartSummary();
}

function updateCartSummary() {
    validateCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    const subtotalEl = document.querySelector('.subtotal');
    const taxEl = document.querySelector('.tax');
    const totalEl = document.querySelector('.total');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <img src="/images/cart.png" alt="Cart" class="cart-notification-icon">
        <span class="cart-notification-message">${message}</span>
    `;
    // Randomize notification color (positive palette)
    const positivePalette = [
        '#3ec6e8', '#4ade80', '#b388ff', '#a3ffb0', '#7fdfff', '#7cfb00', '#00e6e6', '#a259e6',
        '#baffc9', '#bae1ff', '#e066ff', '#b3baff', '#b3fff6', '#c2f0fc', '#e0b3ff', '#b3ffd9',
        '#d1b3ff', '#b3e6ff', '#baffea'
    ];
    let color = positivePalette[Math.floor(Math.random() * positivePalette.length)];
    notification.style.background = color;
    notification.style.color = ['#a3ffb0','#baffc9','#bae1ff','#7cfb00','#4ade80','#b388ff','#3ec6e8','#7fdfff','#b3ffd9','#b3e6ff','#baffea','#b3fff6','#c2f0fc','#e0b3ff','#d1b3ff'].includes(color) ? '#222' : '#fff';
    document.body.appendChild(notification);
    // Add bounce-in animation
    notification.classList.add('cart-notification-bounce-in');
    setTimeout(() => notification.classList.add('cart-notification-fade-out'), 2200);
    setTimeout(() => notification.remove(), 3000);
}

async function checkout() {
    validateCart();
    console.log('Checkout called, cart:', cart);
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const checkoutBtn = document.querySelector('#checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';
    }
    try {
        const backendUrl = window.BACKEND_URL || 'http://localhost:3001';
        console.log('Sending to backend:', backendUrl);
        const cartData = {
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                stripePriceId: item.stripePriceId
            }))
        };
        console.log('Cart data:', cartData);
        const response = await fetch(`${backendUrl}/api/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartData)
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const { sessionId } = await response.json();
        console.log('Got session ID:', sessionId);
        const stripeKey = window.STRIPE_PUBLISHABLE_KEY;
        if (!stripeKey) {
            throw new Error('Stripe publishable key not found');
        }
        const stripe = Stripe(stripeKey);
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert(`Checkout failed: ${error.message}`);
    } finally {
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Checkout';
        }
    }
}

function showCart() {
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-overlay').classList.remove('hidden');
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-drawer').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    updateCartUI();
    renderRecommendations();
}
function hideCart() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-overlay').classList.add('hidden');
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-drawer').classList.add('hidden');
    document.body.style.overflow = '';
}

function renderRecommendations() {
    const allProducts = window.ALL_PRODUCTS || [];
    const cartProductIds = cart.map(item => item.id);
    let recommend = allProducts.filter(p => !cartProductIds.includes(p.id));
    if (recommend.length < 3) {
        // If not enough, fill with random products (including those in cart)
        const others = allProducts.filter(p => cartProductIds.includes(p.id));
        recommend = recommend.concat(others).slice(0, 3);
    } else {
        recommend = recommend.slice(0, 3);
    }
    const container = document.getElementById('cart-recommend-list');
    if (!container) return;
    container.innerHTML = recommend.map(p => `
      <div class="recommend-item">
        <img src="${p.image}" alt="${p.name}">
        <div class="recommend-info">
          <div>${p.name}</div>
          <div style="font-size:0.9em;color:#aef6e2;">$${Number(p.price).toFixed(2)}</div>
        </div>
        <button class="recommend-add" onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}', '${p.stripePriceId}')">Add</button>
      </div>
    `).join('');
}

function applyDiscount() {
    // Placeholder: Implement discount logic or integrate with Stripe Coupons
    alert('Discount code feature coming soon!');
}

document.addEventListener('DOMContentLoaded', function() {
    validateCart();
    console.log('Cart.js loaded, current cart:', cart);
    updateCartUI();
    const checkoutBtn = document.querySelector('#checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.cart = cart;
window.showCart = showCart;
window.hideCart = hideCart;
window.applyDiscount = applyDiscount;

console.log('Cart.js functions exposed globally');
