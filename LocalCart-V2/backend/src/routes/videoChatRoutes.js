import express from 'express';
const router = express.Router();
import { 
  createVideoSession,
  getVideoSessions,
  updateVideoSession
} from '../controllers/videoChatController.js';

router.route('/')
  .post(createVideoSession)
  .get(getVideoSessions);

router.route('/:id')
  .put(updateVideoSession);

export default router;
