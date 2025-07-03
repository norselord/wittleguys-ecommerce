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
    const price = productPrice > 100 ? productPrice / 100 : productPrice;
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
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
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
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #20b2aa;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
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
    document.getElementById('cart-modal').classList.remove('hidden');
    updateCartUI();
}
function hideCart() {
    document.getElementById('cart-modal').classList.add('hidden');
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

console.log('Cart.js functions exposed globally');
