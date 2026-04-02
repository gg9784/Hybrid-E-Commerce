import express from 'express';
const router = express.Router();
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { processCheckout } from '../controllers/checkoutController.js';

router.post('/', verifyJWT, processCheckout);

export default router;
