import catchAsync from '../utils/catchAsync.js';

/**
 * @desc    Process chatbot message
 * @route   POST /api/chatbot/message
 * @access  Public
 */
const processMessage = catchAsync(async (req, res) => {
  const { message } = req.body;

  // Validate input
  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'A valid message is required',
    });
  }

  const normalizedMessage = message.trim().toLowerCase();

  // Helper function for keyword matching
  const includesAny = (keywords) =>
    keywords.some((keyword) => normalizedMessage.includes(keyword));

  // Response mapping
  let response = getChatbotResponse(normalizedMessage, includesAny);

  return res.status(200).json({
    success: true,
    data: { response },
  });
});

/**
 * Generate chatbot response based on user input
 */
const getChatbotResponse = (message, includesAny) => {
  if (includesAny(['hello', 'hi', 'hey'])) {
    return 'Hello! How can I assist you with your shopping today?';
  }

  if (
    includesAny(['store']) &&
    includesAny(['near', 'location', 'nearby'])
  ) {
    return 'You can explore our store locations in the "Find Stores" section. We are available in major cities like Mumbai, Delhi, and Bangalore.';
  }

  if (includesAny(['product', '3d', 'view'])) {
    return 'To experience products in 3D, click on the "View in 3D" option available on the product page.';
  }

  if (includesAny(['delivery', 'shipping'])) {
    return 'We offer delivery within 2-3 business days for most locations. International shipping typically takes 5-7 business days.';
  }

  if (includesAny(['return', 'refund'])) {
    return 'You can return products within 30 days of purchase. Ensure items are in original condition with packaging.';
  }

  if (includesAny(['payment', 'pay'])) {
    return 'We support all major payment methods including credit/debit cards, net banking, and digital wallets with secure transactions.';
  }

  if (includesAny(['discount', 'coupon', 'offer'])) {
    return 'Check out our latest offers on the homepage. Use code WELCOME10 to get 10% off on your first order!';
  }

  if (includesAny(['contact', 'support', 'help'])) {
    return 'You can contact our support team at support@localcart.com or call 1-800-LOCAL-CART.';
  }

  if (includesAny(['thank', 'thanks'])) {
    return 'You’re welcome! Let me know if there’s anything else I can help you with.';
  }

  return 'I’m sorry, I didn’t quite understand that. You can ask about products, delivery, returns, payments, or store locations.';
};

export { processMessage };