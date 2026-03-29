import catchAsync from '../utils/catchAsync.js';

// @desc    Process chatbot message
// @route   POST /api/chatbot/message
// @access  Public
const processMessage = catchAsync(async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }
  
  // Enhanced response logic
  let response;
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    response = 'Hello! How can I help you with your shopping today?';
  } else if (lowerMessage.includes('store') && (lowerMessage.includes('near') || lowerMessage.includes('location'))) {
    response = 'You can find our store locations in the "Find Stores" section. We have stores in multiple cities including Mumbai, Delhi, and Bangalore!';
  } else if (lowerMessage.includes('product') && lowerMessage.includes('3d')) {
    response = 'You can view our products in 3D by clicking on the "View in 3D" button on any product page. This gives you a more immersive shopping experience!';
  } else if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
    response = 'We offer fast delivery within 2-3 business days for most locations. International shipping may take 5-7 business days.';
  } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
    response = 'Our return policy allows returns within 30 days of purchase. Please keep the original packaging for a hassle-free return process.';
  } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
    response = 'We accept all major credit cards, debit cards, net banking, and popular digital wallets. All payments are secure and encrypted.';
  } else if (lowerMessage.includes('discount') || lowerMessage.includes('coupon')) {
    response = 'You can find our current promotions on the homepage. Use code WELCOME10 for a 10% discount on your first purchase!';
  } else if (lowerMessage.includes('contact') || lowerMessage.includes('help')) {
    response = 'You can reach our customer support team at support@localcart.com or call us at 1-800-LOCAL-CART (1-800-562-2522).';
  } else if (lowerMessage.includes('thank')) {
    response = 'You\'re welcome! Is there anything else I can help you with?';
  } else {
    response = 'I\'m not sure I understand. Could you please rephrase your question? You can ask about products, stores, delivery, returns, or payment options.';
  }
  
  res.json({ response });
});

export {
  processMessage
};
