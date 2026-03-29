import { stores, videoSessions } from '../data/mockData.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Create a video chat session
// @route   POST /api/video-sessions
// @access  Public
const createVideoSession = catchAsync(async (req, res) => {
  const { storeId, customerId, roomName } = req.body;
  
  if (!storeId || !customerId || !roomName) {
    res.status(400);
    throw new Error('Please provide storeId, customerId, and roomName');
  }
  
  const store = stores.find(s => s.id === parseInt(storeId));
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }
  
  const session = {
    id: Date.now(),
    storeId: parseInt(storeId),
    customerId,
    roomName,
    status: 'active',
    startTime: new Date().toISOString()
  };
  
  videoSessions.push(session);
  res.status(201).json(session);
});

// @desc    Get video sessions
// @route   GET /api/video-sessions
// @access  Public
const getVideoSessions = catchAsync(async (req, res) => {
  const { storeId, customerId, status } = req.query;
  
  let filteredSessions = [...videoSessions];
  
  if (storeId) filteredSessions = filteredSessions.filter(s => s.storeId === parseInt(storeId));
  if (customerId) filteredSessions = filteredSessions.filter(s => s.customerId === customerId);
  if (status) filteredSessions = filteredSessions.filter(s => s.status === status);
  
  res.json(filteredSessions);
});

// @desc    Update video session status
// @route   PUT /api/video-sessions/:id
// @access  Public
const updateVideoSession = catchAsync(async (req, res) => {
  const { status } = req.body;
  
  const sessionIndex = videoSessions.findIndex(s => s.id === parseInt(req.params.id));
  
  if (sessionIndex === -1) {
    res.status(404);
    throw new Error('Video session not found');
  }
  
  if (status) {
    videoSessions[sessionIndex].status = status;
    if (status === 'ended') {
      videoSessions[sessionIndex].endTime = new Date().toISOString();
    }
  }
  
  res.json(videoSessions[sessionIndex]);
});

export {
  createVideoSession,
  getVideoSessions,
  updateVideoSession
};
