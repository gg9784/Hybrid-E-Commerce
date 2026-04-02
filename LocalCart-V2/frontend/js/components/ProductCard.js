/**
 * ProductCard Component
 * @param {Object} product - The product data from MongoDB
 * @returns {string} - HTML string for the product card
 */
export const ProductCard = (product) => {
  const stockClass = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
  const stockText = product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock';

  return `
    <div class="product-card" data-id="${product._id}">
      <div class="product-image">
        <img src="${product.image || 'https://via.placeholder.com/300x150?text=No+Image'}" alt="${product.name}">
        ${product.stock <= 0 ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
      </div>
      <div class="product-info">
        <div class="product-category-tag">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        
        <div class="product-rating">
          <div class="stars">
            ${Array.from({ length: 5 }, (_, i) => `<i class="${i < Math.floor(product.rating) ? 'fas' : 'far'} fa-star"></i>`).join('')}
          </div>
          <span class="rating-count">(${product.numReviews || 0})</span>
        </div>

        <p class="product-description">${product.description || 'A premium quality product.'}</p>
        
        <div class="product-status-bar">
          <span class="stock-status ${stockClass}">${stockText}</span>
        </div>

        <div class="product-footer">
          <span class="product-price">₹${product.price ? product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</span>
          <button class="btn btn-primary add-to-cart-btn" data-id="${product._id}" ${product.stock <= 0 ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
};
