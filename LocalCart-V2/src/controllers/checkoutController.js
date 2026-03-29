import { getCartData, resetCartData } from './cartController.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Process checkout and create order
// @route   POST /api/checkout
// @access  Public
const processCheckout = catchAsync(async (req, res) => {
  const { name, email, address } = req.body;
  
  if (!name || !email || !address) {
    res.status(400);
    throw new Error('Please provide name, email, and address');
  }
  
  const cartData = getCartData();
  
  if (cartData.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  
  const orderItems = cartData.map(item => ({
    product: item.product.id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    image: item.product.image
  }));
  
  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const order = {
    id: Date.now(),
    customer: { name, email, address },
    items: orderItems,
    total: totalAmount,
    status: 'Pending',
    createdAt: new Date()
  };
  
  // Clear the cart after successful checkout
  resetCartData();
  
  res.status(201).json({
    message: 'Order placed successfully',
    order
  });
});

export {
  processCheckout
};
