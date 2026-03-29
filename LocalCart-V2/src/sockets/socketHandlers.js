import { products, stores } from '../data/mockData.js';

const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join a video chat room
    socket.on('join-video-room', ({ roomName, userName, userType }) => {
      socket.join(roomName);
      
      // Notify others in the room that a new user has joined
      socket.to(roomName).emit('user-joined', {
        socketId: socket.id,
        userName,
        userType
      });
      
      // Send a welcome message to the user who joined
      socket.emit('welcome', {
        message: `Welcome to the video chat with ${roomName}`,
        roomName
      });
      
      console.log(`${userName} (${userType}) joined room: ${roomName}`);
    });
    
    // Handle chat messages within a video session
    socket.on('send-message', ({ roomName, message, sender }) => {
      io.to(roomName).emit('new-message', {
        message,
        sender,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle product sharing during video chat
    socket.on('share-product', ({ roomName, productId }) => {
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        io.to(roomName).emit('product-shared', { product });
      }
    });
    
    // Handle inventory check during video chat
    socket.on('check-inventory', ({ roomName, storeId, productId }) => {
      const store = stores.find(s => s.id === parseInt(storeId));
      if (store) {
        const inventoryItem = store.inventory[productId];
        if (inventoryItem) {
          io.to(roomName).emit('inventory-status', { productId, inventoryItem });
        }
      }
    });
    
    // Handle leaving a video chat room
    socket.on('leave-room', ({ roomName, userName, userType }) => {
      socket.leave(roomName);
      io.to(roomName).emit('user-left', {
        socketId: socket.id,
        userName,
        userType
      });
      console.log(`${userName} (${userType}) left room: ${roomName}`);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export default registerSocketHandlers;
