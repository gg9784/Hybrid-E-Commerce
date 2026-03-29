import { stores } from '../data/mockData.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Fetch all stores
// @route   GET /api/stores
// @access  Public
const getStores = catchAsync(async (req, res) => {
  const searchTerm = req.query.search ? req.query.search.toLowerCase() : '';
  
  if (searchTerm) {
    const filteredStores = stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm) || 
      store.address.toLowerCase().includes(searchTerm)
    );
    return res.json(filteredStores);
  }
  
  res.json(stores);
});

// @desc    Fetch a specific store
// @route   GET /api/stores/:id
// @access  Public
const getStoreById = catchAsync(async (req, res) => {
  const store = stores.find(s => s.id === parseInt(req.params.id));
  
  if (store) {
    res.json(store);
  } else {
    res.status(404);
    throw new Error('Store not found');
  }
});

// @desc    Get store inventory
// @route   GET /api/stores/:id/inventory
// @access  Public
const getStoreInventory = catchAsync(async (req, res) => {
  const store = stores.find(s => s.id === parseInt(req.params.id));
  
  if (store) {
    res.json(store.inventory || {});
  } else {
    res.status(404);
    throw new Error('Store not found');
  }
});

// @desc    Get specific product inventory from store
// @route   GET /api/stores/:id/inventory/:productId
// @access  Public
const getProductInventory = catchAsync(async (req, res) => {
  const store = stores.find(s => s.id === parseInt(req.params.id));
  
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }
  
  const productId = parseInt(req.params.productId);
  const inventoryItem = store.inventory[productId];
  
  if (!inventoryItem) {
    res.status(404);
    throw new Error('Product not found in store inventory');
  }
  
  res.json(inventoryItem);
});

export {
  getStores,
  getStoreById,
  getStoreInventory,
  getProductInventory
};
