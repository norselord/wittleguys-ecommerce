// Mobile Menu Toggle

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
    }
    
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });

    // Newsletter Form Handler
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert('Thank you for subscribing! We\'ll be in touch soon.');
            this.reset();
        });
    }
}); 

// Cart Drawer Logic
function showCartDrawer() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-drawer').classList.remove('hidden');
    document.getElementById('cart-overlay').classList.remove('hidden');
    document.body.classList.add('cart-open'); // Hide mobile menu when cart is open
    updateCartDrawer();
}
function hideCartDrawer() {
    document.getElementById('cart-drawer').classList.remove('open');
    setTimeout(function() {
        document.getElementById('cart-drawer').classList.add('hidden');
    }, 350);
    document.getElementById('cart-overlay').classList.add('hidden');
    document.body.classList.remove('cart-open'); // Show mobile menu when cart is closed
}
function updateCartBadge(count) {
    var badge = document.getElementById('cart-badge');
    badge.textContent = isNaN(count) ? 0 : count;
    document.getElementById('cart-count-drawer').textContent = count > 0 ? `• ${count}` : '';
    // Animate cart icon
    var cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.remove('cart-bounce');
        void cartIcon.offsetWidth; // trigger reflow
        cartIcon.classList.add('cart-bounce');
    }
}
function updateFreeShippingTracker(total) {
    var bar = document.getElementById('free-shipping-bar');
    var msg = document.getElementById('free-shipping-message');
    var needed = 100 - total;
    if (total >= 100) {
        bar.style.width = '100%';
        msg.textContent = 'Free shipping unlocked!';
        msg.style.color = '#4CAF50';
    } else {
        var pct = Math.max(0, Math.min(100, (total / 100) * 100));
        bar.style.width = pct + '%';
        msg.textContent = `You’re $${needed.toFixed(2)} away from free shipping!`;
        msg.style.color = '#7CA982';
    }
}
function updateCartDrawer() {
    var cart = JSON.parse(localStorage.getItem('wittleguys_cart') || '[]');
    var list = document.getElementById('cart-items-list');
    var subtotal = 0;
    list.innerHTML = '';
    cart.forEach(function(item, idx) {
        subtotal += Number(item.price) * Number(item.qty);
        var div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image || '/images/cart.png'}" class="cart-item-img" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title || 'Product'}</div>
                <div class="cart-item-price">$${(item.price || 0).toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button class="cart-item-qty-btn cart-minus" style="color:#e53935;font-weight:700;" onclick="changeCartQty(${idx}, -1)">-</button>
                    <span>${item.qty || 1}</span>
                    <button class="cart-item-qty-btn cart-plus" style="color:#43a047;font-weight:700;" onclick="changeCartQty(${idx}, 1)">+</button>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
    // Tax and shipping
    var tax = subtotal * 0.07; // 7% tax
    var shipping = subtotal >= 100 ? 0 : (subtotal > 0 ? 8.99 : 0);
    var total = subtotal + tax + shipping;
    document.getElementById('cart-total').textContent = total.toFixed(2);
    // Add tax and shipping rows
    var footer = document.querySelector('.cart-drawer-footer');
    if (footer && !document.getElementById('cart-tax-row')) {
        var taxRow = document.createElement('div');
        taxRow.id = 'cart-tax-row';
        taxRow.style = 'font-size:1rem;color:#888;margin-bottom:0.3rem;text-align:right;';
        taxRow.innerHTML = `Tax: $<span id="cart-tax">${tax.toFixed(2)}</span>`;
        var shippingRow = document.createElement('div');
        shippingRow.id = 'cart-shipping-row';
        shippingRow.style = 'font-size:1rem;color:#888;margin-bottom:0.3rem;text-align:right;';
        shippingRow.innerHTML = `Shipping: $<span id="cart-shipping">${shipping.toFixed(2)}</span>`;
        footer.insertBefore(taxRow, footer.firstChild);
        footer.insertBefore(shippingRow, footer.firstChild);
    } else if (footer) {
        document.getElementById('cart-tax').textContent = tax.toFixed(2);
        document.getElementById('cart-shipping').textContent = shipping.toFixed(2);
    }
    updateCartBadge(cart.reduce((sum, i) => sum + Number(i.qty), 0));
    updateFreeShippingTracker(subtotal);
}
function changeCartQty(idx, delta) {
    var cart = JSON.parse(localStorage.getItem('wittleguys_cart') || '[]');
    if (!cart[idx]) return;
    cart[idx].qty += delta;
    if (cart[idx].qty < 1) cart.splice(idx, 1);
    localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
    updateCartDrawer();
}
function checkoutCart() {
    var cart = JSON.parse(localStorage.getItem('wittleguys_cart') || '[]');
    if (!cart.length) {
        alert('Your cart is empty!');
        return;
    }
    fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
    })
    .then(res => res.json())
    .then(async data => {
        if (data.sessionId) {
            var stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);
            await stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else {
            alert('Error creating checkout session: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => {
        alert('Checkout error: ' + err.message);
    });
}
// Add to Cart logic
function addToCart(id, title, price, image, stripePriceId, btn) {
    var cart = JSON.parse(localStorage.getItem('wittleguys_cart') || '[]');
    var found = cart.find(i => i.id === id);
    if (found) {
        found.qty = Number(found.qty) + 1;
    } else {
        cart.push({ id, title, price: Number(price), image, stripePriceId, qty: 1 });
    }
    localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
    updateCartBadge(cart.reduce((sum, i) => sum + Number(i.qty), 0));
    showCartDrawer();
    if (btn) {
        btn.classList.add('processing');
        btn.disabled = true;
        setTimeout(function() {
            btn.classList.remove('processing');
            btn.disabled = false;
        }, 1200);
    }
}
window.addEventListener('DOMContentLoaded', function() {
    // Fix legacy cart items with string qty/price
    var cart = JSON.parse(localStorage.getItem('wittleguys_cart') || '[]');
    var changed = false;
    cart.forEach(function(item) {
        if (typeof item.qty !== 'number') { item.qty = Number(item.qty) || 1; changed = true; }
        if (typeof item.price !== 'number') { item.price = Number(item.price) || 0; changed = true; }
    });
    if (changed) localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
    updateCartBadge(cart.reduce((sum, i) => sum + Number(i.qty), 0));
});

// Add to Cart button logic
window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var button = e.currentTarget;
            button.classList.add('processing');
            button.disabled = true;
            setTimeout(function() {
                button.classList.remove('processing');
                button.disabled = false;
            }, 1200); // Simulate processing, replace with real callback if needed
        });
    });
}); 

// Cart icon bounce animation CSS
(function(){
    var style = document.createElement('style');
    style.innerHTML = `.cart-bounce { animation: cart-bounce 0.5s; }
    @keyframes cart-bounce { 0%{transform:scale(1);} 30%{transform:scale(1.25);} 60%{transform:scale(0.95);} 100%{transform:scale(1);} }`;
    document.head.appendChild(style);
})();
// Randomized coloring for top banner
window.addEventListener('DOMContentLoaded', function() {
    var banner = document.querySelector('.top-banner .banner-text');
    if (banner) {
        var text = banner.textContent;
        banner.innerHTML = '';
        var colors = ['#ff69b4','#3ec6a8','#ff9800','#ffe066','#a259e6','#4ade80','#b388ff','#a3ffb0','#7fdfff','#ff4d4f','#7cfb00','#00e6e6','#ffb347','#ff85a1','#aaff80','#e066ff','#baffc9','#bae1ff'];
        for (var i = 0; i < text.length; i++) {
            var span = document.createElement('span');
            span.textContent = text[i];
            if (text[i] !== ' ') span.style.color = colors[Math.floor(Math.random()*colors.length)];
            banner.appendChild(span);
        }
    }
}); 