import express from 'express';
import { 
  getAdminStats, 
  getAllUsers, 
  toggleUserBlock, 
  deleteUser, 
  getBlacklistedUrls, 
  addBlacklistedUrl, 
  removeBlacklistedUrl 
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/admin.middleware.js';

const router = express.Router();

// Enforce admin validation on all endpoints
router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .delete(deleteUser);

router.put('/users/:id/block', toggleUserBlock);

router.route('/blacklist')
  .get(getBlacklistedUrls)
  .post(addBlacklistedUrl);

router.route('/blacklist/:id')
  .delete(removeBlacklistedUrl);

export default router;
