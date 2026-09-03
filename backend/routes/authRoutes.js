import express from 'express';
import { signup, login, demoLogin, getMe, logout, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validateSignup, validateLogin, validateForgotPassword, validateResetPassword } from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/demo-login', demoLogin);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:resetToken', validateResetPassword, resetPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;

