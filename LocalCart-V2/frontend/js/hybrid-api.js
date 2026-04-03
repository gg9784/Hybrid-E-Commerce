/**
 * Hybrid Shopping Platform API Client
 * This file provides functions to interact with the backend API and Socket.IO
 * for the hybrid shopping platform features (store locator and video chat).
 */

// API Base URL
const API_BASE_URL = '/api';

// Store API Functions
const StoreAPI = {
  // Get all stores or search by term
  getStores: async (searchTerm = '') => {
    try {
      const url = searchTerm
        ? `${API_BASE_URL}/stores?search=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/stores`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch stores');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  },
  
  // Get a specific store by ID
  getStoreById: async (storeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${storeId}`);
      if (!response.ok) throw new Error('Failed to fetch store');
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching store ${storeId}:`, error);
      return null;
    }
  },
  
  // Get inventory for a specific store
  getStoreInventory: async (storeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${storeId}/inventory`);
      if (!response.ok) throw new Error('Failed to fetch store inventory');
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching inventory for store ${storeId}:`, error);
      return {};
    }
  },
  
  // Check inventory for a specific product at a store
  checkProductInventory: async (storeId, productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${storeId}/inventory/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product inventory');
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching inventory for product ${productId} at store ${storeId}:`, error);
      return null;
    }
  },
  
  // Create a new store
  createStore: async (storeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storeData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create store');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  }
};

// Video Chat API Functions
const VideoChatAPI = {
  // Create a new video chat session
  createSession: async (storeId, customerId) => {
    try {
      const roomName = `store-${storeId}-customer-${customerId}-${Date.now()}`;
      
      const response = await fetch(`${API_BASE_URL}/video-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storeId,
          customerId,
          roomName
        })
      });
      
      if (!response.ok) throw new Error('Failed to create video session');
      
      return await response.json();
    } catch (error) {
      console.error('Error creating video session:', error);
      return null;
    }
  },
  
  // Get active video sessions
  getSessions: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.storeId) queryParams.append('storeId', filters.storeId);
      if (filters.customerId) queryParams.append('customerId', filters.customerId);
      if (filters.status) queryParams.append('status', filters.status);
      
      const url = `${API_BASE_URL}/video-sessions?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch video sessions');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching video sessions:', error);
      return [];
    }
  },
  
  // Update a video session status (e.g., end a session)
  updateSessionStatus: async (sessionId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/video-sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update video session');
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating video session ${sessionId}:`, error);
      return null;
    }
  }
};

// Socket.IO Client for real-time communication
class HybridChatClient {
  constructor() {
    this.socket = null;
    this.roomName = null;
    this.connected = false;
    this.callbacks = {
      onConnect: () => {},
      onDisconnect: () => {},
      onUserJoined: () => {},
      onUserLeft: () => {},
      onMessage: () => {},
      onProductShared: () => {},
      onInventoryStatus: () => {}
    };
  }
  
  // Initialize the Socket.IO connection
  init() {
    if (!window.io) {
      console.error('Socket.IO client not loaded');
      return false;
    }
    
    this.socket = io();
    
    this.socket.on('connect', () => {
      this.connected = true;
      this.callbacks.onConnect();
    });
    
    this.socket.on('disconnect', () => {
      this.connected = false;
      this.callbacks.onDisconnect();
    });
    
    this.socket.on('user-joined', (data) => {
      this.callbacks.onUserJoined(data);
    });
    
    this.socket.on('user-left', (data) => {
      this.callbacks.onUserLeft(data);
    });
    
    this.socket.on('new-message', (data) => {
      this.callbacks.onMessage(data);
    });
    
    this.socket.on('product-shared', (data) => {
      this.callbacks.onProductShared(data);
    });
    
    this.socket.on('inventory-status', (data) => {
      this.callbacks.onInventoryStatus(data);
    });
    
    return true;
  }
  
  // Join a video chat room
  joinRoom(roomName, userName, userType) {
    if (!this.connected || !this.socket) {
      console.error('Socket not connected');
      return false;
    }
    
    this.roomName = roomName;
    this.socket.emit('join-video-room', { roomName, userName, userType });
    return true;
  }
  
  // Leave the current video chat room
  leaveRoom(userName, userType) {
    if (!this.connected || !this.socket || !this.roomName) {
      console.error('Not in a room or socket not connected');
      return false;
    }
    
    this.socket.emit('leave-room', { roomName: this.roomName, userName, userType });
    this.roomName = null;
    return true;
  }
  
  // Send a chat message
  sendMessage(message, sender) {
    if (!this.connected || !this.socket || !this.roomName) {
      console.error('Not in a room or socket not connected');
      return false;
    }
    
    this.socket.emit('send-message', {
      roomName: this.roomName,
      message,
      sender
    });
    return true;
  }
  
  // Share a product in the video chat
  shareProduct(productId) {
    if (!this.connected || !this.socket || !this.roomName) {
      console.error('Not in a room or socket not connected');
      return false;
    }
    
    this.socket.emit('share-product', {
      roomName: this.roomName,
      productId
    });
    return true;
  }
  
  // Check inventory for a product during video chat
  checkInventory(storeId, productId) {
    if (!this.connected || !this.socket || !this.roomName) {
      console.error('Not in a room or socket not connected');
      return false;
    }
    
    this.socket.emit('check-inventory', {
      roomName: this.roomName,
      storeId,
      productId
    });
    return true;
  }
  
  // Set event callbacks
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    }
  }
  
  // Disconnect the socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.roomName = null;
    }
  }
}

// Export the API and client
window.HybridShoppingPlatform = {
  StoreAPI,
  VideoChatAPI,
  ChatClient: HybridChatClient
};