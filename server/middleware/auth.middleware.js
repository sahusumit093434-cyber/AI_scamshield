import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { inMemoryUsers } from '../config/inMemoryDb.js';

/**
 * Protect routes - require valid JWT authentication
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'scamshield_local_secret_key_987654321_abcde');
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      // Fallback search in memory
      user = inMemoryUsers.find(u => u._id.toString() === decoded.id.toString());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found with this token' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by an administrator.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

/**
 * Optional authentication - extracts user if token is present, but doesn't block if not.
 * Useful for public scanner routes where we want to increment scan counters for logged-in users.
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'scamshield_local_secret_key_987654321_abcde');
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = inMemoryUsers.find(u => u._id.toString() === decoded.id.toString());
    }

    if (user && user.status === 'active') {
      req.user = user;
    }
    next();
  } catch (error) {
    // Fail silently for optional auth
    next();
  }
};
