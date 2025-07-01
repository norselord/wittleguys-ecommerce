   let cart = JSON.parse(localStorage.getItem('cart')) || [];

   function updateCartCount() {
     document.getElementById('cart-count').textContent = cart.length;
   }

   function updateCartModal() {
     const cartItems = document.getElementById('cart-items');
     cartItems.innerHTML = '';
     let total = 0;
     cart.forEach((item, idx) => {
       total += item.price;
       cartItems.innerHTML += `<li>${item.title} - $${item.price} <button onclick="removeFromCart(${idx})" class="text-red-500 ml-2">Remove</button></li>`;
     });
     document.getElementById('cart-total').textContent = total.toFixed(2);
   }

   function removeFromCart(idx) {
     cart.splice(idx, 1);
     localStorage.setItem('cart', JSON.stringify(cart));
     updateCartCount();
     updateCartModal();
   }

   document.addEventListener('DOMContentLoaded', () => {
     updateCartCount();

     document.querySelectorAll('.add-to-cart').forEach(btn => {
       btn.addEventListener('click', function() {
         const item = {
           title: this.dataset.title,
           price: parseFloat(this.dataset.price),
           image: this.dataset.image
         };
         cart.push(item);
         localStorage.setItem('cart', JSON.stringify(cart));
         updateCartCount();
       });
     });

     document.getElementById('cart-icon').addEventListener('click', () => {
       updateCartModal();
       document.getElementById('cart-modal').classList.remove('hidden');
     });

     document.getElementById('close-cart').addEventListener('click', () => {
       document.getElementById('cart-modal').classList.add('hidden');
     });

     document.getElementById('checkout-btn').addEventListener('click', () => {
       // You will implement Stripe Checkout here in Step 5
       alert('Proceeding to checkout...');
     });
   });
