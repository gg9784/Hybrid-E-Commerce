/**
 * StoreCard Component
 * @param {Object} store - The store data from MongoDB
 * @returns {string} - HTML string for the store card
 */
export const StoreCard = (store) => {
  return `
    <div class="store-card" data-id="${store._id}">
      <div class="store-image">
        <img src="${store.image || 'https://via.placeholder.com/600x300?text=Premium+Store'}" alt="${store.name}">
      </div>
      <div class="store-info">
        <h3>${store.name}</h3>
        <div class="store-rating">
          <div class="stars">
            ${Array.from({ length: 5 }, (_, i) => `<i class="${i < Math.floor(store.rating) ? 'fas' : 'far'} fa-star"></i>`).join('')}
          </div>
          <span class="rating-value">${store.rating} / 5.0</span>
        </div>
        <p class="store-description">${store.description || 'A premium local store offering quality products and personalized service.'}</p>
        <div class="store-meta">
          <span class="store-distance"><i class="fas fa-map-marker-alt"></i> ${store.distance}</span>
          <span class="store-status open">Open Now</span>
        </div>
      </div>
      <div class="store-actions">
        <a href="#/store/${store._id}" class="view-store-btn">Explore Store <i class="fas fa-chevron-right"></i></a>
      </div>
    </div>
  `;
};
