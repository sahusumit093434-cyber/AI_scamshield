import mongoose from 'mongoose';
import connectDB from '../config/db.js';

export const ensureDbConnected = async (req, res, next) => {
  // If health check or test endpoint, bypass middleware
  if (req.path === '/health' || req.path === '/api/test-db') {
    return next();
  }

  if (mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    console.log('Database state offline. Awaiting connection boot...');
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection middleware failed:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed. Please try again.' 
    });
  }
};
