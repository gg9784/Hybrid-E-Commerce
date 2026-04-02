import mongoose from 'mongoose';

const videoSessionSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  customerId: { type: String, required: true },
  roomName: { type: String, required: true },
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  endTime: { type: Date }
}, {
  timestamps: true // adds createdAt (startTime)
});

const VideoSession = mongoose.model('VideoSession', videoSessionSchema);
export default VideoSession;
