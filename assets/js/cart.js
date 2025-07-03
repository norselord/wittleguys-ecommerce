// Cart functionality
let cart = [];

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('wittleguys-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('wittleguys-cart', JSON.stringify(cart));
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Show loading state on button
function showLoading(button) {
    const btnText = button.querySelector('.btn-text');
    const loading = button.querySelector('.loading');
    if (btnText) btnText.style.display = 'none';
    if (loading) loading.style.display = 'flex';
    button.disabled = true;
}

// Hide loading state on button
function hideLoading(button) {
    const btnText = button.querySelector('.btn-text');
    const loading = button.querySelector('.loading');
    if (btnText) btnText.style.display = 'block';
    if (loading) loading.style.display = 'none';
    button.disabled = false;
}

// Add product to cart
async function addToCart(priceId, productName, price, image = null) {
    const button = event.target.closest('button');
    showLoading(button);
    
    try {
        // Check if product already in cart
        const existingItem = cart.find(item => item.priceId === priceId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                priceId,
                productName,
                price,
                image,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartCount();
        
        // Show success message
        setTimeout(() => {
            hideLoading(button);
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="btn-text">✓ Added to Cart</span>';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '#007aff';
            }, 2000);
        }, 500);
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        hideLoading(button);
        alert('Something went wrong!');
    }
}

// Buy product directly (redirect to Stripe)
async function buyProduct(priceId, productName) {
    const button = event.target.closest('button');
    showLoading(button);
    
    try {
        // Redirect directly to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            successUrl: window.location.origin + '/success/',
            cancelUrl: window.location.origin + '/cancel/',
        });
        
        if (error) {
            console.error('Error:', error);
            hideLoading(button);
            alert('Something went wrong!');
        }
        
    } catch (error) {
        console.error('Error:', error);
        hideLoading(button);
        alert('Something went wrong!');
    }
}

// Show cart modal
function showCart() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Render cart items with remove buttons
    cartItems.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
            <div>
                <strong>${item.productName}</strong><br>
                <small>Qty: ${item.quantity}</small>
            </div>
            <div>
                $${(item.price * item.quantity).toFixed(2)}
                <button class="remove-btn" data-idx="${idx}" style="margin-left:10px;color:#c00;background:none;border:none;cursor:pointer;font-size:1.1em;">✕</button>
            </div>
        </div>
    `).join('');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    
    // Show modal
    modal.classList.remove('hidden');

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const idx = parseInt(this.getAttribute('data-idx'));
            removeFromCart(idx);
        });
    });
}

// Remove item from cart by index
function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartCount();
    showCart(); // re-render cart modal
}

// Hide cart modal
function hideCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.add('hidden');
}

// Checkout from cart
async function checkoutFromCart() {
    try {
        // Create line items from cart
        const lineItems = cart.map(item => ({
            price: item.priceId,
            quantity: item.quantity
        }));
        
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
            lineItems,
            mode: 'payment',
            successUrl: window.location.origin + '/success/',
            cancelUrl: window.location.origin + '/cancel/',
        });
        
        if (error) {
            console.error('Error:', error);
            alert('Something went wrong!');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    hideCart();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    
    // Cart modal close button
    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', hideCart);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkoutFromCart);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideCart();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            hideCart();
        }
    });
});

// Export functions for use in templates
window.addToCart = addToCart;
window.buyProduct = buyProduct;
window.showCart = showCart;
window.hideCart = hideCart;
window.clearCart = clearCart;
window.removeFromCart = removeFromCart; 