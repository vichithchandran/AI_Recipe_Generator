import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import { env } from '../config/env.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return next(new ApiError('User associated with this token no longer exists', 401));
    }
    next();
  } catch (err) {
    return next(new ApiError('Invalid or expired authentication token', 401));
  }
};
