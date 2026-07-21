import express from 'express';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
