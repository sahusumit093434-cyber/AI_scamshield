import express from 'express';
import multer from 'multer';
import { 
  createReport, 
  getReports, 
  getReportById, 
  upvoteReport, 
  commentOnReport, 
  deleteReport 
} from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

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

router.route('/')
  .post(protect, upload.single('image'), createReport)
  .get(getReports);

router.route('/:id')
  .get(getReportById)
  .delete(protect, deleteReport);

router.put('/:id/upvote', protect, upvoteReport);
router.post('/:id/comment', protect, commentOnReport);

export default router;
