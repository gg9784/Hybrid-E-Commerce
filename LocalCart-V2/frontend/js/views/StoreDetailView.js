import { ProductCard } from '../components/ProductCard.js';

export const StoreDetailView = {
  render: async (container, params) => {
    const { id } = params;
    
    try {
      // Fetch store details and its inventory from the new integrated API
      const [storeRes, inventoryRes] = await Promise.all([
        fetch(`/api/stores/${id}`),
        fetch(`/api/stores/${id}/inventory`)
      ]);
      
      if (!storeRes.ok) throw new Error('Store not found');
      
      const store = await storeRes.json();
      const inventory = await inventoryRes.json();
      
      // Category options
      const categories = ['Electronics', 'Clothing', 'Healthcare', 'Kirana'];
      let activeCategory = categories.find(cat => inventory.some(p => p.category === cat)) || 'Electronics';

      const renderStorePage = () => {
        const filteredProducts = inventory.filter(p => p.category === activeCategory);

        container.innerHTML = `
          <div class="store-detail-page">
            <header class="store-header" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${store.banner || store.image}')">
              <div class="container">
                <div class="store-header-content">
                  <div class="header-top-row">
                    <a href="#/" class="back-link"><i class="fas fa-arrow-left"></i> Back to Marketplace</a>
                    <button class="btn video-chat-btn" id="start-video-call">
                      <i class="fas fa-video"></i> Video Chat with Owner
                    </button>
                  </div>
                  <div class="store-brand">
                    <img class="store-logo-large" src="${store.image}" alt="${store.name}">
                    <div class="store-brand-text">
                       <h1>${store.name}</h1>
                       <div class="store-rating-large">
                          <i class="fas fa-star"></i> <span>${store.rating}</span>
                          <span class="review-count">Excellent Rating</span>
                       </div>
                    </div>
                  </div>
                  <p class="store-tagline">${store.description}</p>
                  <div class="store-info-badges">
                    <span class="badge"><i class="fas fa-map-marker-alt"></i> ${store.address}</span>
                    <span class="badge"><i class="fas fa-phone"></i> ${store.phone}</span>
                    <span class="badge"><i class="fas fa-clock"></i> ${store.hours}</span>
                  </div>
                </div>
              </div>
            </header>

            <div class="container store-inventory">
              <div class="category-filter-header">
                <h2>Store Inventory</h2>
                <div class="inventory-navigation">
                  ${categories.map(cat => `
                    <button class="category-nav-btn ${activeCategory === cat ? 'active' : ''}" data-category="${cat}">
                      ${cat}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div id="active-category-content">
                <div class="category-section">
                  <h3 class="active-category-title">${activeCategory}</h3>
                  <div class="products-grid">
                    ${filteredProducts.length > 0 
                      ? filteredProducts.map(p => ProductCard(p)).join('')
                      : `<div class="no-items-content">
                           <i class="fas fa-box-open"></i>
                           <p>No products currently available in <strong>${activeCategory}</strong> at this store.</p>
                         </div>`
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        // Attach event listeners after every render
        attachListeners();
      };

      const attachListeners = () => {
        // Category switching
        document.querySelectorAll('.category-nav-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            activeCategory = btn.getAttribute('data-category');
            renderStorePage();
          });
        });

        // Adding to cart (via delegated window function in app.js)
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const productId = btn.getAttribute('data-id');
            if (window.addToCart) {
              window.addToCart(productId, 1);
            }
          });
        });

        // Video Call
        const videoBtn = document.getElementById('start-video-call');
        if (videoBtn) {
          videoBtn.addEventListener('click', () => {
            if (window.startVideoChat) {
              window.startVideoChat(store._id);
            }
          });
        }
      };

      // Initial render
      renderStorePage();

    } catch (error) {
      console.error('Error fetching store details:', error);
      container.innerHTML = `
        <div class="container" style="padding: 100px 0; text-align: center;">
          <h2 class="section-title">Oops! Store Not Found</h2>
          <p>We couldn't load the details for this store. It might have been temporarily closed.</p>
          <a href="#/" class="btn btn-primary" style="margin-top: 2rem;">Back to Marketplace</a>
        </div>
      `;
    }
  }
};
