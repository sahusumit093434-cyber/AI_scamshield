import mongoose from 'mongoose';

const blockedUrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BlockedUrl = mongoose.model('BlockedUrl', blockedUrlSchema);
export default BlockedUrl;
