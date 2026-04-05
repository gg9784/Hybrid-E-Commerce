import User from '../models/User.js';
import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Get cart items
// @route   GET /api/cart
// @access  Private (JWT protected)
const getCart = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  
  // Filter out items where product no longer exists
  const validCart = user.cart.filter(item => item.product !== null);
  
  // If we filtered anything, save the cleaned up cart
  if (validCart.length !== user.cart.length) {
    user.cart = validCart;
    await user.save();
  }
  
  res.json(validCart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(401);
    throw new Error('User not found. Try logging in again.');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found in database');
  }

  const existingItem = user.cart.find(item => item.product && item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += parseInt(quantity) || 1;
  } else {
    user.cart.push({
      product: productId,
      quantity: parseInt(quantity) || 1
    });
  }

  await user.save();
  const populatedUser = await user.populate('cart.product');
  
  // Return cleaned cart
  const finalCart = populatedUser.cart.filter(item => item.product !== null);
  res.status(200).json(finalCart);
});


// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const user = await User.findById(req.user._id);
  const item = user.cart.find(i => i.product && i.product.toString() === productId);

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  if (parseInt(quantity) <= 0) {
    user.cart = user.cart.filter(i => i.product.toString() !== productId);
  } else {
    item.quantity = parseInt(quantity);
  }

  await user.save();
  const populatedUser = await user.populate('cart.product');
  const finalCart = populatedUser.cart.filter(item => item.product !== null);
  res.json(finalCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter(i => i.product && i.product.toString() !== productId);

  await user.save();
  const populatedUser = await user.populate('cart.product');
  const finalCart = populatedUser.cart.filter(item => item.product !== null);
  res.json(finalCart);
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json([]);
});

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
