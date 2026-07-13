import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // allows anonymous scans
  },
  type: {
    type: String,
    enum: ['text', 'url', 'screenshot', 'qr'],
    required: true
  },
  inputData: {
    type: String, // raw text, raw URL, image file path/name, or decoded QR URL
    required: true
  },
  outputData: {
    scamScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      enum: ['Safe', 'Suspicious', 'Dangerous'],
      required: true
    },
    explanation: {
      type: String,
      required: true
    },
    redFlags: [{
      type: String
    }],
    recommendations: [{
      type: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
