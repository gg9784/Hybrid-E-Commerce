import { showNotification } from '../app.js';

export const RegisterStoreView = {
  render: async (container) => {
    // Check if user is logged in
    const userJson = localStorage.getItem('localcart_user');
    if (!userJson) {
      container.innerHTML = `
        <div class="container" style="padding: 100px 20px; text-align: center;">
          <h2>Please Sign In</h2>
          <p>You need to be logged in to register a store.</p>
          <button class="btn" onclick="document.getElementById('nav-login-btn').click()">Sign In Now</button>
        </div>
      `;
      return;
    }

    const user = JSON.parse(userJson);

    container.innerHTML = `
      <section class="register-store-section" style="padding: 60px 0; background: #f8f9fa;">
        <div class="container" style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #714B67; font-size: 2rem; margin-bottom: 10px;">Register Your Store</h2>
            <p style="color: #636e72;">Join our marketplace and start selling to local customers.</p>
          </div>
          
          <form id="register-store-form">
            <div class="form-group" style="margin-bottom: 20px;">
              <label for="store-name" style="display: block; font-weight: 600; margin-bottom: 8px;">Store Name</label>
              <input type="text" id="store-name" required placeholder="Enter your shop name" style="width: 100%; padding: 12px; border: 1px solid #dfe6e9; border-radius: 8px; outline: none;">
            </div>
            
            <div class="form-group" style="margin-bottom: 20px;">
              <label for="store-address" style="display: block; font-weight: 600; margin-bottom: 8px;">Business Address</label>
              <input type="text" id="store-address" required placeholder="Full address of your store" style="width: 100%; padding: 12px; border: 1px solid #dfe6e9; border-radius: 8px; outline: none;">
            </div>
            
            <div class="form-group" style="margin-bottom: 20px;">
              <label for="store-description" style="display: block; font-weight: 600; margin-bottom: 8px;">Description</label>
              <textarea id="store-description" rows="4" required placeholder="What do you sell? Tell your customers about your store..." style="width: 100%; padding: 12px; border: 1px solid #dfe6e9; border-radius: 8px; outline: none; resize: vertical;"></textarea>
            </div>
            
            <div class="form-group" style="margin-bottom: 25px;">
              <label for="store-image" style="display: block; font-weight: 600; margin-bottom: 8px;">Store Image URL</label>
              <input type="url" id="store-image" required placeholder="https://example.com/shop-image.jpg" style="width: 100%; padding: 12px; border: 1px solid #dfe6e9; border-radius: 8px; outline: none;">
              <small style="color: #636e72; font-size: 0.8rem; display: block; mt-2;">Provide a high-quality image of your storefront.</small>
            </div>
            
            <button type="submit" class="btn btn-full" style="width: 100%; padding: 14px; background: #714B67; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: background 0.3s;">
              Complete Registration
            </button>
          </form>
        </div>
      </section>
    `;

    const form = document.getElementById('register-store-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const storeData = {
        name: document.getElementById('store-name').value,
        address: document.getElementById('store-address').value,
        description: document.getElementById('store-description').value,
        image: document.getElementById('store-image').value,
        owner: user._id
      };

      try {
        const { StoreAPI } = window.HybridShoppingPlatform;
        const result = await StoreAPI.createStore(storeData);
        
        showNotification('Store registered successfully!', 'success');
        
        // Redirect to store detail or home
        setTimeout(() => {
          window.location.hash = `#/store/${result._id}`;
        }, 1500);
      } catch (error) {
        showNotification(error.message || 'Failed to register store', 'error');
      }
    });
  }
};
