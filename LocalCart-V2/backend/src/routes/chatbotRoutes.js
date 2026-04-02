import express from 'express';
const router = express.Router();
import { processMessage } from '../controllers/chatbotController.js';

router.route('/message').post(processMessage);

export default router;
