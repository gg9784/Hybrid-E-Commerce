import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Route files
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import videoChatRoutes from './routes/videoChatRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend directory in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Fallback to frontend index.html for unknown unhandled non-api routes 
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
      return res.sendFile(path.join(frontendPath, 'index.html'));
    }
    next();
  });
}
app.use(cookieParser());

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/video-sessions', videoChatRoutes);
app.use('/api/contact-us', contactRoutes);

// Error handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
