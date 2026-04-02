import { router } from './router.js';
import { HomeView } from './views/HomeView.js';
import { StoreDetailView } from './views/StoreDetailView.js';
import { initVideoChat } from './videoChat.js';

// Global API_URL
const API_URL = '/api';

// Global Cart State
let cart = [];

// DOM Elements for global UI
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartButton = document.getElementById('cart-button');
const clearCartButton = document.getElementById('clear-cart');
const checkoutButton = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const orderItems = document.getElementById('order-items');
const orderTotal = document.getElementById('order-total');
const confirmationModal = document.getElementById('confirmation-modal');
const orderId = document.getElementById('order-id');
const orderEmail = document.getElementById('order-email');
const continueShoppingButton = document.getElementById('continue-shopping');

// Fetch and update global cart
const fetchCart = async () => {
    try {
        const response = await fetch(`${API_URL}/cart`);
        if (response.ok) {
            cart = await response.json();
            updateCartUI();
        } else {
            // Probably not logged in
            cart = [];
            updateCartUI();
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        cart = [];
        updateCartUI();
    }
};

// Global Add to Cart
window.addToCart = async (productId, quantity) => {
    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity: parseInt(quantity) || 1 }),
        });
        
        if (response.status === 401) {
            showNotification('Please login to add items to cart', 'error');
            document.getElementById('nav-login-btn').click();
            return;
        }

        cart = await response.json();
        updateCartUI();
        showNotification('Product added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add product to cart.', 'error');
    }
};

// Update Cart UI
const updateCartUI = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    cartItems.innerHTML = '';
    
    if (!cart || cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutButton.disabled = true;
        checkoutButton.classList.add('disabled');
        cartTotal.textContent = '₹0.00';
    } else {
        cart.forEach(item => {
            const product = item.product;
            if (!product) return;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">₹${product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div class="cart-item-actions">
                        <div class="cart-quantity">
                            <button class="cart-quantity-btn minus" data-id="${product._id}">-</button>
                            <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1" max="50" data-id="${product._id}">
                            <button class="cart-quantity-btn plus" data-id="${product._id}">+</button>
                        </div>
                        <div class="remove-item" data-id="${product._id}">Remove</div>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        checkoutButton.disabled = false;
        checkoutButton.classList.remove('disabled');

        const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        cartTotal.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        
        orderTotal.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }
    
    // Add event listeners to cart elements
    document.querySelectorAll('.cart-quantity-btn.minus').forEach(button => {
        button.onclick = () => updateCartItemQuantity(button.dataset.id, -1);
    });

    document.querySelectorAll('.cart-quantity-btn.plus').forEach(button => {
        button.onclick = () => updateCartItemQuantity(button.dataset.id, 1);
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.onclick = () => removeCartItem(button.dataset.id);
    });
};

const updateCartItemQuantity = async (productId, delta) => {
    const item = cart.find(i => i.product._id === productId);
    if (!item) return;
    
    const newQty = item.quantity + delta;
    if (newQty < 1) return removeCartItem(productId);
    
    try {
        const response = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQty }),
        });
        cart = await response.json();
        updateCartUI();
    } catch (error) { console.error(error); }
};

const removeCartItem = async (productId) => {
    try {
        const response = await fetch(`${API_URL}/cart/${productId}`, { method: 'DELETE' });
        cart = await response.json();
        updateCartUI();
    } catch (error) { console.error(error); }
};

const clearCartItems = async () => {
    try {
        const response = await fetch(`${API_URL}/cart`, { method: 'DELETE' });
        cart = await response.json();
        updateCartUI();
    } catch (error) { console.error(error); }
};

const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Checkout
const checkout = async (customerData) => {
    try {
      const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || 'Checkout failed');

      orderId.textContent = result.order._id;
      orderEmail.textContent = result.order.customer.email;
      
      cart = [];
      updateCartUI();
      checkoutModal.style.display = 'none';
      confirmationModal.style.display = 'block';
    } catch (error) {
      console.error(error);
      showNotification(error.message, 'error');
    }
};

// Global Search
const handleGlobalSearch = () => {
    const query = document.getElementById('global-search-input').value;
    const category = document.getElementById('search-cat-select').value;
    
    if (!query && !category) return;
    
    console.log(`Global search for: ${query} in ${category}`);
    // Future: implement SearchView and redirect
    // router.navigate(`/search?q=${query}&cat=${category}`);
    showNotification('Search feature coming soon!', 'info');
};

// Event Listeners for Cart
cartButton.onclick = (e) => { e.preventDefault(); cartModal.style.display = 'block'; fetchCart(); };
clearCartButton.onclick = clearCartItems;
checkoutButton.onclick = () => { 
  if (cart.length > 0) { 
    cartModal.style.display = 'none'; 
    checkoutModal.style.display = 'block'; 
    
    // Auto-fill checkout if user data exists
    orderItems.innerHTML = cart.map(item => `
      <div class="order-summary-item">
        <span>${item.product.name} x ${item.quantity}</span>
        <span>₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
      </div>
    `).join('');
  } 
};

checkoutForm.onsubmit = (e) => {
    e.preventDefault();
    checkout({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    });
};

continueShoppingButton.onclick = () => confirmationModal.style.display = 'none';

// Global Search Listeners
document.getElementById('global-search-btn').onclick = handleGlobalSearch;
document.getElementById('global-search-input').onkeypress = (e) => {
  if (e.key === 'Enter') handleGlobalSearch();
};

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    try {
      const response = await fetch(`${API_URL}/contact-us`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();
      if (response.ok) {
        showNotification(data.message || 'Message sent successfully!');
        contactForm.reset();
      } else {
        showNotification(data.message || 'Failed to send message.', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Something went wrong. Please try again later.', 'error');
    }
  });
}

// Close modals
document.querySelectorAll('.close').forEach(btn => {
    btn.onclick = () => btn.closest('.modal').style.display = 'none';
});

window.onclick = (e) => {
    if (e.target.classList.contains('modal')) e.target.style.display = 'none';
};

// Initialize Router and App
document.addEventListener('DOMContentLoaded', () => {
    router.addRoute('/', HomeView);
    router.addRoute('/store/:id', StoreDetailView);
    
    // Trigger initial route
    router.handleRoute();
    fetchCart();
    initVideoChat();
});

export { fetchCart, showNotification };