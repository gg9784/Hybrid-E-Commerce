/**
 * Chatbot Implementation for LocalCart
 * This file implements a simple chatbot to assist users with shopping and product inquiries
 */

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
});

/**
 * Initialize the chatbot functionality
 */
function initChatbot() {
  // Create chatbot elements if they don't exist
  createChatbotElements();
  
  // Set up event listeners
  setupChatbotEventListeners();
}

/**
 * Create the chatbot UI elements and append to the document
 */
function createChatbotElements() {
  // Check if chatbot container already exists
  if (document.querySelector('.chatbot-container')) {
    return;
  }
  
  // Create chatbot container
  const chatbotContainer = document.createElement('div');
  chatbotContainer.className = 'chatbot-container';
  
  // Create chatbot icon
  const chatbotIcon = document.createElement('div');
  chatbotIcon.className = 'chatbot-icon';
  chatbotIcon.innerHTML = '<i class="fas fa-comment"></i>';
  
  // Create chatbot panel
  const chatbotPanel = document.createElement('div');
  chatbotPanel.className = 'chatbot-panel';
  chatbotPanel.style.display = 'none';
  
  // Create chatbot header
  const chatbotHeader = document.createElement('div');
  chatbotHeader.className = 'chatbot-header';
  chatbotHeader.innerHTML = `
    <h3>LocalCart Assistant</h3>
    <button class="chatbot-close"><i class="fas fa-times"></i></button>
  `;
  
  // Create chatbot messages container
  const chatbotMessages = document.createElement('div');
  chatbotMessages.className = 'chatbot-messages';
  
  // Create chatbot input area
  const chatbotInput = document.createElement('div');
  chatbotInput.className = 'chatbot-input';
  chatbotInput.innerHTML = `
    <input type="text" placeholder="Type your question here..." id="chatbot-input-field">
    <button id="chatbot-send"><i class="fas fa-paper-plane"></i></button>
  `;
  
  // Assemble the chatbot elements
  chatbotPanel.appendChild(chatbotHeader);
  chatbotPanel.appendChild(chatbotMessages);
  chatbotPanel.appendChild(chatbotInput);
  
  chatbotContainer.appendChild(chatbotIcon);
  chatbotContainer.appendChild(chatbotPanel);
  
  // Add to the document
  document.body.appendChild(chatbotContainer);
}

/**
 * Set up event listeners for chatbot interactions
 */
function setupChatbotEventListeners() {
  // Get chatbot elements
  const chatbotIcon = document.querySelector('.chatbot-icon');
  const chatbotPanel = document.querySelector('.chatbot-panel');
  const chatbotClose = document.querySelector('.chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input-field');
  const chatbotSend = document.getElementById('chatbot-send');
  
  // Toggle chatbot panel when icon is clicked
  chatbotIcon.addEventListener('click', () => {
    chatbotPanel.style.display = chatbotPanel.style.display === 'none' ? 'flex' : 'none';
    if (chatbotPanel.style.display === 'flex') {
      // Add welcome message if this is the first open
      const chatbotMessages = document.querySelector('.chatbot-messages');
      if (chatbotMessages.children.length === 0) {
        addChatbotMessage('Hello! Welcome to LocalCart. How can I help you today?', 'bot');
      }
      // Focus on input field
      chatbotInput.focus();
    }
  });
  
  // Close chatbot panel when close button is clicked
  chatbotClose.addEventListener('click', () => {
    chatbotPanel.style.display = 'none';
  });
  
  // Send message when send button is clicked
  chatbotSend.addEventListener('click', () => {
    sendUserMessage();
  });
  
  // Send message when Enter key is pressed in input field
  chatbotInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      sendUserMessage();
    }
  });
}

/**
 * Send user message and get bot response
 */
function sendUserMessage() {
  const chatbotInput = document.getElementById('chatbot-input-field');
  const message = chatbotInput.value.trim();
  
  if (message === '') return;
  
  // Add user message to chat
  addChatbotMessage(message, 'user');
  
  // Clear input field
  chatbotInput.value = '';
  
  // Process the message and get response
  processUserMessage(message);
}

/**
 * Add a message to the chatbot messages container
 * @param {string} message - The message text
 * @param {string} sender - 'user' or 'bot'
 */
function addChatbotMessage(message, sender) {
  const chatbotMessages = document.querySelector('.chatbot-messages');
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `chatbot-message ${sender}-message`;
  messageElement.textContent = message;
  
  // Add message to container
  chatbotMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * Process user message and generate response
 * @param {string} message - The user's message
 */
function processUserMessage(message) {
  // Show typing indicator
  const chatbotMessages = document.querySelector('.chatbot-messages');
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'chatbot-message bot-message typing-indicator';
  typingIndicator.textContent = 'Typing...';
  chatbotMessages.appendChild(typingIndicator);
  
  // Send message to server API
  fetch('/api/chatbot/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to get chatbot response');
    }
    return response.json();
  })
  .then(data => {
    // Remove typing indicator
    chatbotMessages.removeChild(typingIndicator);
    
    // Add bot response to chat
    addChatbotMessage(data.response, 'bot');
  })
  .catch(error => {
    console.error('Error getting chatbot response:', error);
    
    // Remove typing indicator
    chatbotMessages.removeChild(typingIndicator);
    
    // Add error message
    addChatbotMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'bot');
  });
}

/**
 * Convert message to lowercase for easier matching
 * @param {string} message - The user's message
 */
function processUserMessage(message) {
  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();
  
  // Simulate typing delay
  setTimeout(() => {
    let response;
    
    // Simple pattern matching for common questions
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
    
    // Add bot response to chat
    addChatbotMessage(response, 'bot');
  }, 600); // Delay to simulate thinking
}