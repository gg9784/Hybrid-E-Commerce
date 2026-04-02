import express from 'express';
import { submitMessage } from '../controllers/contactController.js';

const router = express.Router();

// @route   POST /api/contact-us
// @desc    Submit a contact message
// @access  Public
router.post('/', submitMessage);

export default router;
