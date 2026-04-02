import Order from '../models/Order.js';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Process checkout and create order
// @route   POST /api/checkout
// @access  Private
const processCheckout = catchAsync(async (req, res) => {
  const { name, email, address } = req.body;
  
  if (!name || !email || !address) {
    res.status(400);
    throw new Error('Please provide name, email, and address');
  }
  
  const user = await User.findById(req.user._id).populate('cart.product');
  
  if (!user.cart || user.cart.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  
  const orderItems = user.cart.map(item => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    image: item.product.image
  }));
  
  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const order = await Order.create({
    customer: { name, email, address },
    items: orderItems,
    total: totalAmount,
    status: 'Pending'
  });
  
  // Clear the user's cart in DB after successful checkout
  user.cart = [];
  await user.save();
  
  res.status(201).json({
    message: 'Order placed successfully',
    order
  });
});

export {
  processCheckout
};
