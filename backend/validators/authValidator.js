import ApiError from '../utils/apiError.js';

export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    return next(new ApiError('Validation Error', 400, errors));
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return next(new ApiError('Validation Error', 400, errors));
  }

  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (errors.length > 0) {
    return next(new ApiError('Validation Error', 400, errors));
  }

  next();
};

export const validateResetPassword = (req, res, next) => {
  const { password } = req.body;
  const errors = [];

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  if (errors.length > 0) {
    return next(new ApiError('Validation Error', 400, errors));
  }

  next();
};

