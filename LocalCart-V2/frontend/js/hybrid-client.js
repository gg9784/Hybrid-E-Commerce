/**
 * Hybrid Shopping Platform Client Implementation
 * This file implements the client-side functionality for the hybrid shopping platform,
 * integrating the store locator and video chat features with the main shopping experience.
 */

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the hybrid shopping platform features
  initHybridFeatures();
});

/**
 * Initialize all hybrid shopping platform features
 */
function initHybridFeatures() {
  // Initialize store locator functionality
  initStoreLocator();
  
  // Initialize video chat functionality
  initVideoChat();
}

/**
 * Initialize the store locator functionality
 */
function initStoreLocator() {
  const storesContainer = document.getElementById('stores-container');
  const storeSearchInput = document.getElementById('store-search-input');
  const storeSearchButton = document.getElementById('store-search-button');
  
  if (!storesContainer || !storeSearchInput || !storeSearchButton) {
    console.error('Store locator elements not found');
    return;
  }
  
  // Load initial stores
  loadStores();
  
  // Add event listener for search button
  storeSearchButton.addEventListener('click', () => {
    const searchTerm = storeSearchInput.value.trim();
    loadStores(searchTerm);
  });
  
  // Add event listener for search input (search on Enter key)
  storeSearchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const searchTerm = storeSearchInput.value.trim();
      loadStores(searchTerm);
    }
  });
}

/**
 * Load stores from the API and render them
 * @param {string} searchTerm - Optional search term to filter stores
 */
async function loadStores(searchTerm = '') {
  const storesContainer = document.getElementById('stores-container');
  
  if (!storesContainer) return;
  
  // Show loading state
  storesContainer.innerHTML = '<div class="loading">Loading stores...</div>';
  
  try {
    // Use the API client to fetch stores
    const stores = await window.HybridShoppingPlatform.StoreAPI.getStores(searchTerm);
    
    if (stores.length === 0) {
      storesContainer.innerHTML = '<div class="no-results">No stores found</div>';
      return;
    }
    
    // Render the stores
    renderStores(stores);
  } catch (error) {
    console.error('Error loading stores:', error);
    storesContainer.innerHTML = '<div class="error">Failed to load stores. Please try again later.</div>';
  }
}

/**
 * Render the stores in the store locator
 * @param {Array} stores - Array of store objects
 */
function renderStores(stores) {
  const storesContainer = document.getElementById('stores-container');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (!storesContainer) return;
  
  storesContainer.innerHTML = '';
  
  stores.forEach(store => {
    const storeCard = document.createElement('div');
    storeCard.className = 'store-card';
    
    // Check inventory status for cart items
    const inventoryStatus = checkCartItemsInventory(store, cart);
    
    storeCard.innerHTML = `
      <div class="store-image">
        <img src="${store.image}" alt="${store.name}">
      </div>
      <div class="store-info">
        <h3>${store.name}</h3>
        <p><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
        <p><i class="fas fa-phone"></i> ${store.phone}</p>
        <p><i class="fas fa-clock"></i> ${store.hours}</p>
        <p><i class="fas fa-route"></i> ${store.distance} miles away</p>
      </div>
      <div class="store-inventory-status ${inventoryStatus.statusClass}">
        <p><i class="${inventoryStatus.icon}"></i> ${inventoryStatus.text}</p>
      </div>
      <div class="store-actions">
        <button class="btn btn-primary view-inventory-btn" data-store-id="${store.id}">View Inventory</button>
        <button class="btn btn-secondary start-video-chat-btn" data-store-id="${store.id}">Video Chat</button>
      </div>
    `;
    
    storesContainer.appendChild(storeCard);
    
    // Add event listeners to the buttons
    const viewInventoryBtn = storeCard.querySelector('.view-inventory-btn');
    const startVideoChatBtn = storeCard.querySelector('.start-video-chat-btn');
    
    viewInventoryBtn.addEventListener('click', () => {
      showStoreInventory(store.id);
    });
    
    startVideoChatBtn.addEventListener('click', () => {
      startVideoChat(store.id);
    });
  });
}

/**
 * Check inventory status for cart items at a store
 * @param {Object} store - Store object
 * @param {Array} cart - Cart items
 * @returns {Object} - Status object with text, icon, and class
 */
function checkCartItemsInventory(store, cart) {
  if (cart.length === 0) {
    return {
      text: 'No items in cart to check',
      icon: 'fas fa-info-circle',
      statusClass: 'inventory-neutral'
    };
  }
  
  let allAvailable = true;
  let someAvailable = false;
  let totalItems = 0;
  let availableItems = 0;
  
  cart.forEach(item => {
    const productId = item.id.toString();
    totalItems++;
    
    if (store.inventory && store.inventory[productId]) {
      const inventoryItem = store.inventory[productId];
      if (inventoryItem.status === 'in_stock' && inventoryItem.quantity >= item.quantity) {
        someAvailable = true;
        availableItems++;
      } else {
        allAvailable = false;
      }
    } else {
      allAvailable = false;
    }
  });
  
  if (allAvailable) {
    return {
      text: 'All items in your cart are available',
      icon: 'fas fa-check-circle',
      statusClass: 'inventory-available'
    };
  } else if (someAvailable) {
    return {
      text: `${availableItems} of ${totalItems} items available`,
      icon: 'fas fa-exclamation-circle',
      statusClass: 'inventory-partial'
    };
  } else {
    return {
      text: 'Items in your cart are not available',
      icon: 'fas fa-times-circle',
      statusClass: 'inventory-unavailable'
    };
  }
}

/**
 * Show inventory for a specific store
 * @param {number} storeId - Store ID
 */
async function showStoreInventory(storeId) {
  try {
    // Fetch store details and inventory
    const store = await window.HybridShoppingPlatform.StoreAPI.getStoreById(storeId);
    
    if (!store) {
      showNotification('Store not found', 'error');
      return;
    }
    
    // Create a modal to display the inventory
    const modal = document.createElement('div');
    modal.className = 'modal inventory-modal';
    modal.id = 'inventory-modal';
    
    // Get the cart items to highlight them in the inventory
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartProductIds = cart.map(item => item.id.toString());
    
    // Create the inventory items HTML
    let inventoryItemsHtml = '';
    
    if (store.inventory) {
      const productIds = Object.keys(store.inventory);
      
      if (productIds.length === 0) {
        inventoryItemsHtml = '<p>No inventory information available</p>';
      } else {
        // Fetch all products to get their details
        const response = await fetch('/api/products');
        const products = await response.json();
        
        // Create inventory items
        productIds.forEach(productId => {
          const inventoryItem = store.inventory[productId];
          const product = products.find(p => p.id.toString() === productId);
          
          if (product) {
            const inCart = cartProductIds.includes(productId);
            const cartItem = inCart ? cart.find(item => item.id.toString() === productId) : null;
            const cartQuantity = cartItem ? cartItem.quantity : 0;
            
            const statusClass = inventoryItem.status === 'in_stock' ? 'in-stock' : 'out-of-stock';
            const cartClass = inCart ? 'in-cart' : '';
            
            inventoryItemsHtml += `
              <div class="inventory-item ${statusClass} ${cartClass}">
                <div class="inventory-item-image">
                  <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="inventory-item-info">
                  <h4>${product.name}</h4>
                  <p class="inventory-item-price">$${product.price.toFixed(2)}</p>
                  <p class="inventory-item-status">
                    <span class="status-indicator ${statusClass}"></span>
                    ${inventoryItem.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    ${inventoryItem.status === 'in_stock' ? `(${inventoryItem.quantity} available)` : ''}
                  </p>
                  ${inCart ? `<p class="in-cart-indicator">In your cart (${cartQuantity})</p>` : ''}
                </div>
              </div>
            `;
          }
        });
      }
    } else {
      inventoryItemsHtml = '<p>No inventory information available</p>';
    }
    
    // Create the modal content
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${store.name} Inventory</h2>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="store-details">
            <p><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
            <p><i class="fas fa-phone"></i> ${store.phone}</p>
            <p><i class="fas fa-clock"></i> ${store.hours}</p>
          </div>
          <div class="inventory-items">
            ${inventoryItemsHtml}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary close-inventory-btn">Close</button>
          <button class="btn btn-primary start-video-chat-btn" data-store-id="${store.id}">Start Video Chat</button>
        </div>
      </div>
    `;
    
    // Add the modal to the document
    document.body.appendChild(modal);
    
    // Show the modal
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    
    // Add event listeners
    const closeModalBtn = modal.querySelector('.close-modal');
    const closeInventoryBtn = modal.querySelector('.close-inventory-btn');
    const startVideoChatBtn = modal.querySelector('.start-video-chat-btn');
    
    closeModalBtn.addEventListener('click', () => {
      closeInventoryModal();
    });
    
    closeInventoryBtn.addEventListener('click', () => {
      closeInventoryModal();
    });
    
    startVideoChatBtn.addEventListener('click', () => {
      closeInventoryModal();
      startVideoChat(store.id);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeInventoryModal();
      }
    });
  } catch (error) {
    console.error('Error showing store inventory:', error);
    showNotification('Failed to load store inventory', 'error');
  }
}

/**
 * Close the inventory modal
 */
function closeInventoryModal() {
  const modal = document.getElementById('inventory-modal');
  
  if (modal) {
    modal.classList.remove('show');
    
    // Remove the modal after animation
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

/**
 * Initialize the video chat functionality
 */
function initVideoChat() {
  const videoChatToggle = document.getElementById('video-chat-toggle');
  const videoChatContainer = document.getElementById('video-chat-container');
  const videoChatClose = document.getElementById('video-chat-close');
  
  if (!videoChatToggle || !videoChatContainer || !videoChatClose) {
    console.error('Video chat elements not found');
    return;
  }
  
  // Initialize the chat client
  window.chatClient = new window.HybridShoppingPlatform.ChatClient();
  
  // Add event listener for video chat toggle button
  videoChatToggle.addEventListener('click', () => {
    // If video chat is already active, show it
    if (window.videoChat && window.videoChat.isActive) {
      videoChatContainer.classList.add('active');
    } else {
      // Otherwise, show notification
      showNotification('Please start a video chat from a store first', 'info');
    }
  });
  
  // Add event listener for video chat close button
  videoChatClose.addEventListener('click', () => {
    videoChatContainer.classList.remove('active');
  });
}

/**
 * Start a video chat with a store
 * @param {number} storeId - Store ID
 */
async function startVideoChat(storeId) {
  try {
    // Get the video chat elements
    const videoChatContainer = document.getElementById('video-chat-container');
    const videoChatContent = document.getElementById('video-chat-content');
    const videoChatInfo = document.getElementById('video-chat-info');
    
    if (!videoChatContainer || !videoChatContent || !videoChatInfo) {
      console.error('Video chat elements not found');
      return;
    }
    
    // Show the container and backdrop
    let backdrop = document.getElementById('video-chat-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'video-chat-backdrop';
        backdrop.className = 'video-chat-backdrop';
        document.body.appendChild(backdrop);
    }
    
    // Show loading state
    videoChatInfo.innerHTML = 'Connecting to store...';
    backdrop.classList.add('active');
    videoChatContainer.classList.add('active');

    
    // Get store details
    const store = await window.HybridShoppingPlatform.StoreAPI.getStoreById(storeId);
    
    if (!store) {
      videoChatInfo.innerHTML = 'Store not found';
      return;
    }
    
    // Generate a customer ID (in a real app, this would be a user ID)
    const customerId = 'customer-' + Date.now();
    
    // Create a video session
    const session = await window.HybridShoppingPlatform.VideoChatAPI.createSession(storeId, customerId);
    
    if (!session) {
      videoChatInfo.innerHTML = 'Failed to create video session';
      return;
    }
    
    // Initialize Jitsi Meet
    if (!window.JitsiMeetExternalAPI) {
      videoChatInfo.innerHTML = 'Video chat API not loaded';
      return;
    }
    
    // Clear previous video chat instance
    if (window.videoChat) {
      if (window.videoChat.isActive) {
        window.videoChat.dispose();
      }
      window.videoChat = null;
    }
    
    // Clear the video chat content
    videoChatContent.innerHTML = '';
    
    // Update info
    videoChatInfo.innerHTML = `Connected to ${store.name}`;
    
    // Initialize the Jitsi Meet API
    const domain = 'meet.jit.si';
    const options = {
      roomName: session.roomName,
      width: '100%',
      height: '100%',
      parentNode: videoChatContent,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        prejoinPageEnabled: false
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_REMOTE_DISPLAY_NAME: 'Store Associate',
        TOOLBAR_ALWAYS_VISIBLE: true
      },
      userInfo: {
        displayName: 'Customer'
      }
    };
    
    // Create the Jitsi Meet instance
    window.videoChat = new window.JitsiMeetExternalAPI(domain, options);
    window.videoChat.isActive = true;
    
    // Add event listeners
    window.videoChat.addEventListeners({
      videoConferenceJoined: () => {
        // Initialize the chat client
        if (!window.chatClient.connected) {
          window.chatClient.init();
        }
        
        // Join the room
        window.chatClient.joinRoom(session.roomName, 'Customer', 'customer');
        
        // Show notification
        showNotification(`Connected to ${store.name} via video chat`, 'success');
      },
      videoConferenceLeft: () => {
        // Leave the room
        window.chatClient.leaveRoom('Customer', 'customer');
        
        // Close the video chat
        closeVideoChat();
      }
    });
    
    // Set up chat client event handlers
    window.chatClient.on('onProductShared', (data) => {
      // Show the shared product
      showSharedProduct(data.product);
    });
    
    window.chatClient.on('onInventoryStatus', (data) => {
      // Show the inventory status
      showInventoryStatus(data.productId, data.inventoryItem);
    });
  } catch (error) {
    console.error('Error starting video chat:', error);
    showNotification('Failed to start video chat', 'error');
  }
}

/**
 * Close the video chat
 */
function closeVideoChat() {
  const videoChatContainer = document.getElementById('video-chat-container');
  const backdrop = document.getElementById('video-chat-backdrop');
  
  if (videoChatContainer) {
    videoChatContainer.classList.remove('active');
  }
  
  if (backdrop) {
    backdrop.classList.remove('active');
  }

  
  if (window.videoChat && window.videoChat.isActive) {
    window.videoChat.dispose();
    window.videoChat.isActive = false;
  }
  
  // Disconnect the chat client
  if (window.chatClient && window.chatClient.connected) {
    window.chatClient.disconnect();
  }
  
  showNotification('Video chat ended', 'info');
}

/**
 * Show a shared product during video chat
 * @param {Object} product - Product object
 */
function showSharedProduct(product) {
  // Create a modal to display the shared product
  const modal = document.createElement('div');
  modal.className = 'modal shared-product-modal';
  modal.id = 'shared-product-modal';
  
  // Create the modal content
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Shared Product</h2>
        <span class="close-modal">&times;</span>
      </div>
      <div class="modal-body">
        <div class="shared-product">
          <div class="shared-product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="shared-product-info">
            <h3>${product.name}</h3>
            <p class="shared-product-price">$${product.price.toFixed(2)}</p>
            <p class="shared-product-description">${product.description}</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary close-shared-product-btn">Close</button>
        <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
  
  // Add the modal to the document
  document.body.appendChild(modal);
  
  // Show the modal
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Add event listeners
  const closeModalBtn = modal.querySelector('.close-modal');
  const closeSharedProductBtn = modal.querySelector('.close-shared-product-btn');
  const addToCartBtn = modal.querySelector('.add-to-cart-btn');
  
  closeModalBtn.addEventListener('click', () => {
    closeSharedProductModal();
  });
  
  closeSharedProductBtn.addEventListener('click', () => {
    closeSharedProductModal();
  });
  
  addToCartBtn.addEventListener('click', () => {
    // Add the product to the cart
    addToCart(product.id, 1);
    closeSharedProductModal();
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeSharedProductModal();
    }
  });
}

/**
 * Close the shared product modal
 */
function closeSharedProductModal() {
  const modal = document.getElementById('shared-product-modal');
  
  if (modal) {
    modal.classList.remove('show');
    
    // Remove the modal after animation
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

/**
 * Show inventory status for a product
 * @param {string} productId - Product ID
 * @param {Object} inventoryItem - Inventory item object
 */
function showInventoryStatus(productId, inventoryItem) {
  // Create a notification with the inventory status
  const statusText = inventoryItem.status === 'in_stock'
    ? `Product is in stock (${inventoryItem.quantity} available)`
    : 'Product is out of stock';
  
  const notificationType = inventoryItem.status === 'in_stock' ? 'success' : 'warning';
  
  showNotification(statusText, notificationType);
}

/**
 * Show a notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = message;
  
  document.body.appendChild(notification);
  
  // Show the notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove the notification after a delay
  setTimeout(() => {
    notification.classList.remove('show');
    
    // Remove the element after animation
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}