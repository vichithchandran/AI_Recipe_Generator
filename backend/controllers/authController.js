import User from '../models/User.js';
import UserPreference from '../models/UserPreference.js';
import ApiError from '../utils/apiError.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { env } from '../config/env.js';
import crypto from 'crypto';
import { ensureDemoUser, refreshDemoDataIfStale, DEMO_RESET_MINUTES } from '../services/demoService.js';

/** Shape the user object sent to the client. */
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  created_at: user.createdAt,
  is_demo: !!user.is_demo,
});

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ApiError('User already exists with this email address', 400));
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // Create default preferences
    await UserPreference.create({
      user: user._id,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return next(new ApiError('Invalid email or password', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ApiError('Invalid email or password', 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sign in to the shared portfolio demo account
// @route   POST /api/auth/demo-login
// @access  Public
export const demoLogin = async (req, res, next) => {
  try {
    const { user, seeded } = await ensureDemoUser();

    // Give each visitor a freshly populated account once the window has passed.
    const reseeded = seeded ? false : await refreshDemoDataIfStale(user);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: publicUser(user),
      demo: {
        reset_minutes: DEMO_RESET_MINUTES,
        data_refreshed: seeded || reseeded,
      },
      message: 'Signed in to the demo account',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: publicUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout current user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Send Reset Email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new ApiError('There is no user registered with that email address', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL (dynamically uses request origin if available)
    const frontendOrigin = req.headers.origin || env.FRONTEND_URL;
    const resetUrl = `${frontendOrigin}/reset-password?token=${resetToken}`;


    const message = `You are receiving this email because you (or someone else) requested a password reset for your AI Recipe Generator account.\n\nPlease click on the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background-color: #090d16; color: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #10b981; font-size: 24px; font-weight: 800; margin: 0;">🍳 AI Recipe Generator</h1>
          <h2 style="color: #ffffff; font-size: 20px; margin-top: 12px;">Password Reset Request</h2>
        </div>
        <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
        <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password for your account:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: #022c22; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">Or copy and paste this link into your web browser:</p>
        <p style="background-color: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155; word-break: break-all; font-size: 13px; color: #34d399;">${resetUrl}</p>
        <p style="color: #64748b; font-size: 13px; margin-top: 24px;">This link will expire in <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 32px 0 16px 0;" />
        <p style="color: #475569; font-size: 12px; text-center: center; margin: 0;">&copy; ${new Date().getFullYear()} AI Recipe Generator. All rights reserved.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request - AI Recipe Generator',
        text: message,
        html,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to your email',
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ApiError('Email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const rawToken = req.params.resetToken || req.body.token;

    if (!rawToken) {
      return next(new ApiError('Reset token is required', 400));
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError('Invalid or expired reset token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

