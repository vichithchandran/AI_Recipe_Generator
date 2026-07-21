import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getPreferences,
  updatePreferences,
  deleteAccount,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);
router.delete('/account', deleteAccount);

export default router;
