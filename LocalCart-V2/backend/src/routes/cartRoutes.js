import express from 'express';
const router = express.Router();
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controllers/cartController.js';

router.route('/')
  .get(verifyJWT, getCart)
  .post(verifyJWT, addToCart)
  .delete(verifyJWT, clearCart);

router.route('/:productId')
  .put(verifyJWT, updateCartItem)
  .delete(verifyJWT, removeFromCart);

export default router;
