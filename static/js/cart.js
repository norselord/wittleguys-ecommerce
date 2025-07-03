// Wittleguys Cart - Fixed Version
let cart = JSON.parse(localStorage.getItem('wittleguys_cart') || '[]');

// Add to cart function - now handles both old and new parameter formats
function addToCart(productId, productName, productPrice, productImageOrPriceId, stripePrice) {
    console.log('addToCart called with:', { productId, productName, productPrice, productImageOrPriceId, stripePrice });
    
    // Handle different parameter formats
    let productImage = '/images/products/default.jpg'; // Default image
    let stripePriceId = productImageOrPriceId;
    
    // If 5 parameters, assume: (id, name, price, image, priceId)
    if (arguments.length === 5) {
        productImage = productImageOrPriceId;
        stripePriceId = stripePrice;
    }
    // If 4 parameters, assume: (id, name, price, priceId) - use default image
    else if (arguments.length === 4) {
        stripePriceId = productImageOrPriceId;
    }
    
    // Convert price from cents to dollars if needed
    const price = productPrice > 100 ? productPrice / 100 : productPrice;
    
    // Check if item already exists
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
    
    saveCart();
    updateCartUI();
    showNotification(`${productName} added to cart!`);
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    console.log('updateQuantity called:', { productId, newQuantity });
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
    }
}

// Remove from cart
function removeFromCart(productId) {
    console.log('removeFromCart called:', { productId });
    
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
    updateCartCount();
    updateCartDisplay();
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Update cart display (for cart page)
function updateCartDisplay() {
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

// Update cart summary
function updateCartSummary() {
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

// Show notification
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

// Checkout function
async function checkout() {
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

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart.js loaded, current cart:', cart);
    updateCartUI();
    
    // Bind checkout button
    const checkoutBtn = document.querySelector('#checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

// Expose functions globally
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.cart = cart;

console.log('Cart.js functions exposed globally');
