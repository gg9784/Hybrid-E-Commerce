import express from 'express';
const router = express.Router();
import { processCheckout } from '../controllers/checkoutController.js';

router.route('/').post(processCheckout);

export default router;
