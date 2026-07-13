import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Analysis from '../models/analysis.model.js';
import Report from '../models/report.model.js';
import { inMemoryUsers, inMemoryAnalyses, inMemoryReports } from '../config/inMemoryDb.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'scamshield_local_secret_key_987654321_abcde', 
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all details.' });
    }

    if (true) {
      // ----------------------------------------
      // Live MongoDB Mode
      // ----------------------------------------
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const isFirstUser = (await User.countDocuments({})) === 0;
      const role = isFirstUser ? 'admin' : 'user';

      const user = await User.create({ name, email, password, role });

      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    } else {
      // ----------------------------------------
      // Fallback In-Memory Mode
      // ----------------------------------------
      console.log('MongoDB offline: registering user in-memory.');
      const userExists = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const role = inMemoryUsers.length === 0 ? 'admin' : 'user';
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = {
        _id: `mock_user_id_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        status: 'active',
        totalAnalyses: 0,
        totalReports: 0,
        createdAt: new Date()
      };

      inMemoryUsers.push(user);

      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

/**
 * @desc    Log in existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (true) {
      // ----------------------------------------
      // Live MongoDB Mode
      // ----------------------------------------
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      if (user.status === 'blocked') {
        return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      return res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    } else {
      // ----------------------------------------
      // Fallback In-Memory Mode
      // ----------------------------------------
      console.log('MongoDB offline: logging in user in-memory.');
      const user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      if (user.status === 'blocked') {
        return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      return res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

/**
 * @desc    Get user profile details
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    if (true) {
      // ----------------------------------------
      // Live MongoDB Mode
      // ----------------------------------------
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const totalAnalyses = await Analysis.countDocuments({ userId: user._id });
      const totalReports = await Report.countDocuments({ userId: user._id });

      user.totalAnalyses = totalAnalyses;
      user.totalReports = totalReports;
      await user.save();

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          totalAnalyses,
          totalReports,
          status: user.status,
          createdAt: user.createdAt
        }
      });
    } else {
      // ----------------------------------------
      // Fallback In-Memory Mode
      // ----------------------------------------
      const user = inMemoryUsers.find(u => u._id.toString() === req.user.id.toString());
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const totalAnalyses = inMemoryAnalyses.filter(item => item.userId?.toString() === user._id.toString()).length;
      const totalReports = inMemoryReports.filter(item => item.userId?.toString() === user._id.toString()).length;

      user.totalAnalyses = totalAnalyses;
      user.totalReports = totalReports;

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          totalAnalyses: user.totalAnalyses,
          totalReports: user.totalReports,
          status: user.status,
          createdAt: user.createdAt
        }
      });
    }
  } catch (error) {
    console.error('Get profile error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
};
