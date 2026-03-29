import { products } from '../data/mockData.js';
import catchAsync from '../utils/catchAsync.js';

// Cart API (in-memory storage for simplicity, matching original implementation)
let cart = [];

// @desc    Get cart items
// @route   GET /api/cart
// @access  Public
const getCart = (req, res) => {
  res.json(cart);
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public
const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  const existingItem = cart.find(item => item.product.id === parseInt(productId));
  
  if (existingItem) {
    existingItem.quantity += parseInt(quantity) || 1;
  } else {
    cart.push({
      product,
      quantity: parseInt(quantity) || 1
    });
  }
  
  res.json(cart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Public
const updateCartItem = (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  
  const itemIndex = cart.findIndex(item => item.product.id === parseInt(productId));
  
  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }
  
  if (parseInt(quantity) <= 0) {
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = parseInt(quantity);
  }
  
  res.json(cart);
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Public
const removeFromCart = (req, res) => {
  const { productId } = req.params;
  
  const itemIndex = cart.findIndex(item => item.product.id === parseInt(productId));
  
  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }
  
  cart.splice(itemIndex, 1);
  res.json(cart);
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Public
const clearCart = (req, res) => {
  cart = [];
  res.json(cart);
};

// Helper to provide the cart variable to other controllers like checkout
const getCartData = () => cart;
const resetCartData = () => { cart = []; };

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartData,
  resetCartData
};
