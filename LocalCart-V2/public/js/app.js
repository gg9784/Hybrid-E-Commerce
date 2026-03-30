document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const productsContainer = document.getElementById('products-container');
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
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Close buttons for modals
  const closeButtons = document.querySelectorAll('.close');

  // API URL (change this to your actual API URL in production)
  const API_URL = '/api';

  // State
  let products = [];
  let cart = [];
  let currentFilter = 'all';

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      products = await response.json();
      renderProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
      // If API fails, use sample data
      products = getSampleProducts();
      renderProducts();
    }
  };

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`);
      cart = await response.json();
      updateCartUI();
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If API fails, use local cart
      updateCartUI();
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity) => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      cart = await response.json();
      updateCartUI();
      showNotification('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      // If API fails, add to local cart
      const product = products.find(p => p.id === productId);
      const existingItem = cart.find(item => item.product.id === productId);
      
      if (existingItem) {
        existingItem.quantity += parseInt(quantity) || 1;
      } else {
        cart.push({
          product,
          quantity: parseInt(quantity) || 1
        });
      }
      
      updateCartUI();
      showNotification('Product added to cart!');
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      cart = await response.json();
      updateCartUI();
    } catch (error) {
      console.error('Error updating cart item:', error);
      // If API fails, update local cart
      const itemIndex = cart.findIndex(item => item.product.id === productId);
      
      if (itemIndex !== -1) {
        if (parseInt(quantity) <= 0) {
          cart.splice(itemIndex, 1);
        } else {
          cart[itemIndex].quantity = parseInt(quantity);
        }
      }
      
      updateCartUI();
    }
  };

  // Remove item from cart
  const removeCartItem = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
      });
      cart = await response.json();
      updateCartUI();
    } catch (error) {
      console.error('Error removing cart item:', error);
      // If API fails, remove from local cart
      const itemIndex = cart.findIndex(item => item.product.id === productId);
      
      if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
      }
      
      updateCartUI();
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
      });
      cart = await response.json();
      updateCartUI();
    } catch (error) {
      console.error('Error clearing cart:', error);
      // If API fails, clear local cart
      cart = [];
      updateCartUI();
    }
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
      
      // Show confirmation
      orderId.textContent = result.order.id;
      orderEmail.textContent = result.order.customer.email;
      
      // Clear cart and close checkout modal
      cart = [];
      updateCartUI();
      checkoutModal.style.display = 'none';
      confirmationModal.style.display = 'block';
      
      return true;
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error processing your order. Please try again.');
      return false;
    }
  };

  // Render products
  const renderProducts = () => {
    productsContainer.innerHTML = '';
    
    const filteredProducts = currentFilter === 'all' 
      ? products 
      : products.filter(product => product.category === currentFilter);
    
    filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">₹${product.price.toFixed(2)}</div>
          <div class="product-description">${product.description}</div>
          <div class="product-actions">
            <div class="quantity-control">
              <button class="quantity-btn minus" data-id="${product.id}">-</button>
              <input type="number" class="quantity-input" value="1" min="1" max="10" data-id="${product.id}">
              <button class="quantity-btn plus" data-id="${product.id}">+</button>
            </div>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      `;
      
      productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to quantity buttons and add to cart buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.getAttribute('data-id'));
        const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
        let value = parseInt(input.value) - 1;
        if (value < 1) value = 1;
        input.value = value;
      });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.getAttribute('data-id'));
        const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
        let value = parseInt(input.value) + 1;
        if (value > 10) value = 10;
        input.value = value;
      });
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.getAttribute('data-id'));
        const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
        const quantity = parseInt(input.value);
        addToCart(productId, quantity);
      });
    });
  };

  // Update cart UI
  const updateCartUI = () => {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      checkoutButton.disabled = true;
      checkoutButton.classList.add('disabled');
    } else {
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="cart-item-image">
            <img src="${item.product.image}" alt="${item.product.name}">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${item.product.name}</div>
            <div class="cart-item-price">₹${item.product.price.toFixed(2)}</div>
            <div class="cart-item-actions">
              <div class="cart-quantity">
                <button class="cart-quantity-btn minus" data-id="${item.product.id}">-</button>
                <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1" max="10" data-id="${item.product.id}">
                <button class="cart-quantity-btn plus" data-id="${item.product.id}">+</button>
              </div>
              <div class="remove-item" data-id="${item.product.id}">Remove</div>
            </div>
          </div>
        `;
        
        cartItems.appendChild(cartItem);
      });
      
      checkoutButton.disabled = false;
      checkoutButton.classList.remove('disabled');
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toFixed(2)}`;
    
    // Update order items and total in checkout modal
    orderItems.innerHTML = '';
    cart.forEach(item => {
      const orderItem = document.createElement('div');
      orderItem.className = 'order-item';
      orderItem.innerHTML = `
        <span>${item.product.name} x ${item.quantity}</span>
        <span>₹${(item.product.price * item.quantity).toFixed(2)}</span>
      `;
      
      orderItems.appendChild(orderItem);
    });
    
    orderTotal.textContent = `₹${total.toFixed(2)}`;
    
    // Add event listeners to cart quantity buttons and remove buttons
    document.querySelectorAll('.cart-quantity-btn.minus').forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.getAttribute('data-id'));
        const input = document.querySelector(`.cart-quantity-input[data-id="${productId}"]`);
        let value = parseInt(input.value) - 1;
        if (value < 1) value = 1;
        input.value = value;
        updateCartItem(productId, value);
      });
    });
    
    document.querySelectorAll('.cart-quantity-btn.plus').forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.getAttribute('data-id'));
        const input = document.querySelector(`.cart-quantity-input[data-id="${productId}"]`);
        let value = parseInt(input.value) + 1;
        if (value > 10) value = 10;
        input.value = value;
        updateCartItem(productId, value);
      });
    });
    
    document.querySelectorAll('.cart-quantity-input').forEach(input => {
      input.addEventListener('change', () => {
        const productId = parseInt(input.getAttribute('data-id'));
        let value = parseInt(input.value);
        if (value < 1) value = 1;
        if (value > 10) value = 10;
        input.value = value;
        updateCartItem(productId, value);
      });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.getAttribute('data-id'));
        removeCartItem(productId);
      });
    });
  };

  // Show notification
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  // Sample products (fallback if API fails)
  const getSampleProducts = () => {
    return [
      {
        id: 1,
        name: 'Smartphone',
        price: 699.99,
        description: 'Latest model with high-resolution camera and fast processor',
        image: 'smartphone.svg',
        category: 'Electronics'
      },
      {
        id: 2,
        name: 'Laptop',
        price: 1299.99,
        description: 'Powerful laptop with SSD storage and high-performance graphics',
        image: 'laptop.svg',
        category: 'Electronics'
      },
      {
        id: 3,
        name: 'Headphones',
        price: 199.99,
        description: 'Noise-cancelling wireless headphones with premium sound quality',
        image: 'headphones.svg',
        category: 'Electronics'
      },
      {
        id: 4,
        name: 'Running Shoes',
        price: 89.99,
        description: 'Comfortable running shoes with cushioned soles',
        image: 'shoes.svg',
        category: 'Clothing'
      },
      {
        id: 5,
        name: 'Coffee Maker',
        price: 79.99,
        description: 'Programmable coffee maker with thermal carafe',
        image: 'coffee-maker.svg',
        category: 'Home'
      },
      {
        id: 6,
        name: 'Backpack',
        price: 49.99,
        description: 'Durable backpack with multiple compartments',
        image: 'backpack.svg',
        category: 'Accessories'
      }
    ];
  };

  // Event Listeners
  
  // Cart button
  cartButton.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
  });
  
  // Clear cart button
  clearCartButton.addEventListener('click', () => {
    clearCart();
  });
  
  // Checkout button
  checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
  });
  
  // Checkout form
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    
    checkout({ name, email, address });
  });
  
  // Continue shopping button
  continueShoppingButton.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
  });
  
  // Filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      currentFilter = button.getAttribute('data-category');
      renderProducts();
    });
  });
  
  // Close buttons
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      modal.style.display = 'none';
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // Initialize
  fetchProducts();
  fetchCart();

  // Add CSS for notifications
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.3s, transform 0.3s;
    }
    
    .notification.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    .disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
});