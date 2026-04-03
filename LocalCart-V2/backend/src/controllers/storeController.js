import Store from '../models/Store.js';
import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Fetch all stores
// @route   GET /api/stores
// @access  Public

const getStores = catchAsync(async (req, res) => {
  const searchTerm = req.query.search
    ? {
        name: {
          $regex: req.query.search,
          $options: 'i',
        },
      }
    : {};

  const stores = await Store.find({ ...searchTerm });
  res.json(stores);
});


// @desc    Create a new store
// @route   POST /api/stores
// @access  Private (or Public if you want)
const createStore = catchAsync(async (req, res) => {
  const { name, description, image, owner } = req.body;

  const store = new Store({
    name,
    description,
    image,
    owner, // optional (if you track store owner)
    inventory: new Map(), // initialize empty inventory
  });

  const createdStore = await store.save();

  res.status(201).json(createdStore);
});



// @desc    Fetch a specific store
// @route   GET /api/stores/:id
// @access  Public



const getStoreById = catchAsync(async (req, res) => {
  const store = await Store.findById(req.params.id);
  
  if (store) {
    res.json(store);
  } else {
    res.status(404);
    throw new Error('Store not found');
  }
});


// @desc    Get store inventory with product details
// @route   GET /api/stores/:id/inventory
// @access  Public


const getStoreInventory = catchAsync(async (req, res) => {
  const store = await Store.findById(req.params.id);
  
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }


  // Get all product IDs from the inventory map


  const productIds = Array.from(store.inventory.keys());
  

  // Fetch detailed product info for these IDs


  const products = await Product.find({ _id: { $in: productIds } });


  // Combine product info with inventory data (status/quantity)


  const fullInventory = products.map(product => {
    const invData = store.inventory.get(product._id.toString());
    return {
      ...product.toObject(),
      status: invData.status,
      quantity: invData.quantity
    };
  });

  res.json(fullInventory);
});



// @desc    Get specific product inventory from store
// @route   GET /api/stores/:id/inventory/:productId
// @access  Public


const getProductInventory = catchAsync(async (req, res) => {
  const store = await Store.findById(req.params.id);
  
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }
  
  const inventoryItem = store.inventory.get(req.params.productId);
  
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
  getProductInventory,
  createStore
};