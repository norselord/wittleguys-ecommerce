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
    updateCartDrawer();
}
function hideCartDrawer() {
    document.getElementById('cart-drawer').classList.remove('open');
    setTimeout(function() {
        document.getElementById('cart-drawer').classList.add('hidden');
    }, 350);
    document.getElementById('cart-overlay').classList.add('hidden');
}
function updateCartBadge(count) {
    document.getElementById('cart-badge').textContent = count;
    document.getElementById('cart-count-drawer').textContent = count > 0 ? `• ${count}` : '';
}
function updateFreeShippingTracker(total) {
    var bar = document.getElementById('free-shipping-bar');
    var msg = document.getElementById('free-shipping-message');
    var needed = 100 - total;
    if (total >= 100) {
        bar.style.width = '100%';
        msg.textContent = 'Free shipping unlocked!';
    } else {
        var pct = Math.max(0, Math.min(100, (total / 100) * 100));
        bar.style.width = pct + '%';
        msg.textContent = `You’re $${needed.toFixed(2)} away from free shipping!`;
    }
}
function updateCartDrawer() {
    var cart = JSON.parse(localStorage.getItem('wittleguys_cart') || '[]');
    var list = document.getElementById('cart-items-list');
    var total = 0;
    list.innerHTML = '';
    cart.forEach(function(item, idx) {
        total += item.price * item.qty;
        var div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" class="cart-item-img" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button class="cart-item-qty-btn" onclick="changeCartQty(${idx}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="cart-item-qty-btn" onclick="changeCartQty(${idx}, 1)">+</button>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
    document.getElementById('cart-total').textContent = total.toFixed(2);
    updateCartBadge(cart.reduce((sum, i) => sum + i.qty, 0));
    updateFreeShippingTracker(total);
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
    window.location.href = '/checkout';
}
// Add to Cart logic
function addToCart(id, title, price, image, stripePriceId, btn) {
    var cart = JSON.parse(localStorage.getItem('wittleguys_cart') || '[]');
    var found = cart.find(i => i.id === id);
    if (found) {
        found.qty += 1;
    } else {
        cart.push({ id, title, price, image, stripePriceId, qty: 1 });
    }
    localStorage.setItem('wittleguys_cart', JSON.stringify(cart));
    updateCartBadge(cart.reduce((sum, i) => sum + i.qty, 0));
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
    updateCartBadge((JSON.parse(localStorage.getItem('wittleguys_cart') || '[]')).reduce((sum, i) => sum + i.qty, 0));
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