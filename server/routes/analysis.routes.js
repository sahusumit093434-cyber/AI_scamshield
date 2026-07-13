import express from 'express';
import multer from 'multer';
import { 
  analyzeText, 
  analyzeUrl, 
  analyzeScreenshot, 
  analyzeQrCode, 
  getUserHistory, 
  deleteAnalysis 
} from '../controllers/analysis.controller.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';
import { scanLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Configure multer storage in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limits
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Scanning endpoints (open to guests, tracks users if logged in)
router.post('/text', scanLimiter, optionalAuth, analyzeText);
router.post('/url', scanLimiter, optionalAuth, analyzeUrl);
router.post('/screenshot', scanLimiter, optionalAuth, upload.single('image'), analyzeScreenshot);
router.post('/qr', scanLimiter, optionalAuth, upload.single('image'), analyzeQrCode);

// Personal scan history (requires login)
router.get('/history', protect, getUserHistory);
router.delete('/:id', protect, deleteAnalysis);

export default router;
