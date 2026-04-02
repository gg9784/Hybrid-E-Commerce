import { StoreCard } from '../components/StoreCard.js';
import { ProductCard } from '../components/ProductCard.js';

export const HomeView = {
  render: async (container) => {
    container.innerHTML = `
      <!-- Marketplace Hero -->
      <section class="marketplace-hero">
        <div class="hero-overlay"></div>
        <div class="container">
          <div class="hero-content">
            <span class="hero-badge">New Hybrid Shopping Experience</span>
            <h1>Shop Local, <br>Experience <span>Global</span></h1>
            <p>The ultimate multi-vendor marketplace where you can virtually visit stores, view 3D products, and video chat with owners.</p>
            <div class="hero-btns">
              <a href="#stores" class="btn btn-primary">Visit Stores</a>
              <a href="#about" class="btn btn-secondary">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Grid -->
      <section class="category-section">
        <div class="container">
          <h2 class="section-title">Shop by Category</h2>
          <div class="category-grid">
            <div class="category-item" data-category="Electronics">
              <div class="cat-icon"><i class="fas fa-plug"></i></div>
              <span>Electronics</span>
            </div>
            <div class="category-item" data-category="Clothing">
              <div class="cat-icon"><i class="fas fa-tshirt"></i></div>
              <span>Clothing</span>
            </div>
            <div class="category-item" data-category="Healthcare">
              <div class="cat-icon"><i class="fas fa-heartbeat"></i></div>
              <span>Healthcare</span>
            </div>
            <div class="category-item" data-category="Kirana">
              <div class="cat-icon"><i class="fas fa-shopping-basket"></i></div>
              <span>Kirana</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Stores Section -->
      <section id="stores" class="stores-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Featured Local Stores</h2>
            <p>Hand-picked premium stores near you</p>
          </div>
          <div id="stores-grid" class="stores-grid">
            <div class="loading-shimmer"></div>
          </div>
        </div>
      </section>

      <!-- Trending Products Section -->
      <section id="trending" class="trending-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Trending Products</h2>
            <p>Popular items across all stores</p>
          </div>
          <div id="products-grid" class="products-grid">
            <div class="loading-shimmer"></div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="about-section">
        <div class="container">
           <div class="about-grid">
              <div class="about-image">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Marketplace">
              </div>
              <div class="about-text">
                <h2 class="section-title">Why LocalCart?</h2>
                <p>We bridge the gap between traditional local trust and modern digital convenience. Our platform empowers both retailers and consumers through innovative tech.</p>
                <ul class="benefit-list">
                  <li><i class="fas fa-check-circle"></i> <strong>3D Product Previews</strong> - See every detail before you buy.</li>
                  <li><i class="fas fa-check-circle"></i> <strong>Live Video Chat</strong> - Personalized service from your favorite shop owners.</li>
                  <li><i class="fas fa-check-circle"></i> <strong>Instant Local Delivery</strong> - Support your neighborhood economy.</li>
                </ul>
              </div>
           </div>
        </div>
      </section>
    `;

    // Fetch and render data
    const loadMarketplaceData = async () => {
      try {
        const [storesRes, productsRes] = await Promise.all([
          fetch('/api/stores'),
          fetch('/api/products')
        ]);
        
        const stores = await storesRes.json();
        const products = await productsRes.json();
        
        const storesGrid = document.getElementById('stores-grid');
        const productsGrid = document.getElementById('products-grid');
        
        // Render Stores (first 3)
        storesGrid.innerHTML = stores.slice(0, 3).map(store => StoreCard(store)).join('');
        
        // Render Products (first 4)
        productsGrid.innerHTML = products.slice(0, 4).map(product => ProductCard(product)).join('');

        // Attach category click listeners
        document.querySelectorAll('.category-item').forEach(item => {
          item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            // For now, redirect to specialized search (future feature) or just filter products
            console.log(`Filter by category: ${category}`);
          });
        });

      } catch (error) {
        console.error('Error fetching marketplace data:', error);
      }
    };

    loadMarketplaceData();
  }
};
