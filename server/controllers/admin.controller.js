import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Analysis from '../models/analysis.model.js';
import Report from '../models/report.model.js';
import BlockedUrl from '../models/blockedUrl.model.js';
import { inMemoryUsers, inMemoryAnalyses, inMemoryReports, inMemoryBlockedUrls } from '../config/inMemoryDb.js';

/**
 * @desc    Get dashboard statistics for administrator dashboard
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Live MongoDB Mode
      const totalUsers = await User.countDocuments({});
      const totalAnalyses = await Analysis.countDocuments({});
      const totalReports = await Report.countDocuments({});
      const totalBlockedUrls = await BlockedUrl.countDocuments({});

      const textScans = await Analysis.countDocuments({ type: 'text' });
      const urlScans = await Analysis.countDocuments({ type: 'url' });
      const screenshotScans = await Analysis.countDocuments({ type: 'screenshot' });
      const qrScans = await Analysis.countDocuments({ type: 'qr' });

      const safeScans = await Analysis.countDocuments({ 'outputData.riskLevel': 'Safe' });
      const suspiciousScans = await Analysis.countDocuments({ 'outputData.riskLevel': 'Suspicious' });
      const dangerousScans = await Analysis.countDocuments({ 'outputData.riskLevel': 'Dangerous' });

      return res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          totalAnalyses,
          totalReports,
          totalBlockedUrls,
          breakdown: { text: textScans, url: urlScans, screenshot: screenshotScans, qr: qrScans },
          riskBreakdown: { safe: safeScans, suspicious: suspiciousScans, dangerous: dangerousScans }
        }
      });
    } else {
      // Fallback In-Memory Mode
      console.log('MongoDB offline: fetching admin stats from in-memory.');
      const totalUsers = inMemoryUsers.length;
      const totalAnalyses = inMemoryAnalyses.length;
      const totalReports = inMemoryReports.length;
      const totalBlockedUrls = inMemoryBlockedUrls.length;

      const textScans = inMemoryAnalyses.filter(item => item.type === 'text').length;
      const urlScans = inMemoryAnalyses.filter(item => item.type === 'url').length;
      const screenshotScans = inMemoryAnalyses.filter(item => item.type === 'screenshot').length;
      const qrScans = inMemoryAnalyses.filter(item => item.type === 'qr').length;

      const safeScans = inMemoryAnalyses.filter(item => item.outputData.riskLevel === 'Safe').length;
      const suspiciousScans = inMemoryAnalyses.filter(item => item.outputData.riskLevel === 'Suspicious').length;
      const dangerousScans = inMemoryAnalyses.filter(item => item.outputData.riskLevel === 'Dangerous').length;

      return res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          totalAnalyses,
          totalReports,
          totalBlockedUrls,
          breakdown: { text: textScans, url: urlScans, screenshot: screenshotScans, qr: qrScans },
          riskBreakdown: { safe: safeScans, suspicious: suspiciousScans, dangerous: dangerousScans }
        }
      });
    }
  } catch (error) {
    console.error('Fetch admin stats error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve administrative statistics.' });
  }
};

/**
 * @desc    List all registered users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: users });
    } else {
      console.log('MongoDB offline: pulling user list from in-memory.');
      const list = inMemoryUsers.map(({ password, ...u }) => u);
      return res.status(200).json({ success: true, data: list });
    }
  } catch (error) {
    console.error('List users error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user directory.' });
  }
};

/**
 * @desc    Toggle user status (Active vs Blocked)
 * @route   PUT /api/admin/users/:id/block
 * @access  Private/Admin
 */
export const toggleUserBlock = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot block administrative accounts.' });
      }

      user.status = user.status === 'active' ? 'blocked' : 'active';
      await user.save();

      return res.status(200).json({ success: true, message: `User status changed to ${user.status}.`, user });
    } else {
      const user = inMemoryUsers.find(item => item._id.toString() === req.params.id.toString());
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot block administrative accounts.' });
      }

      user.status = user.status === 'active' ? 'blocked' : 'active';
      return res.status(200).json({ success: true, message: `User status changed to ${user.status}.`, user });
    }
  } catch (error) {
    console.error('Toggle block error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to alter user status.' });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot delete administrative accounts.' });
      }

      await Analysis.deleteMany({ userId: user._id });
      await Report.deleteMany({ userId: user._id });
      await user.deleteOne();
      return res.status(200).json({ success: true, message: 'User account and associated data purged.' });
    } else {
      const index = inMemoryUsers.findIndex(item => item._id.toString() === req.params.id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const user = inMemoryUsers[index];
      if (user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot delete administrative accounts.' });
      }

      // Purge logs in-memory
      for (let i = inMemoryAnalyses.length - 1; i >= 0; i--) {
        if (inMemoryAnalyses[i].userId?.toString() === user._id.toString()) {
          inMemoryAnalyses.splice(i, 1);
        }
      }
      for (let i = inMemoryReports.length - 1; i >= 0; i--) {
        if (inMemoryReports[i].userId?.toString() === user._id.toString()) {
          inMemoryReports.splice(i, 1);
        }
      }

      inMemoryUsers.splice(index, 1);
      return res.status(200).json({ success: true, message: 'User account and associated data purged.' });
    }
  } catch (error) {
    console.error('Delete user error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};

/**
 * @desc    Get all blacklisted URLs
 * @route   GET /api/admin/blacklist
 * @access  Private/Admin
 */
export const getBlacklistedUrls = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const list = await BlockedUrl.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: list });
    } else {
      console.log('MongoDB offline: fetching blacklist in-memory.');
      return res.status(200).json({ success: true, data: inMemoryBlockedUrls });
    }
  } catch (error) {
    console.error('Fetch blacklist error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve blacklist.' });
  }
};

/**
 * @desc    Add a URL to the global blacklist
 * @route   POST /api/admin/blacklist
 * @access  Private/Admin
 */
export const addBlacklistedUrl = async (req, res) => {
  const { url, reason } = req.body;

  try {
    if (!url || !reason) {
      return res.status(400).json({ success: false, message: 'URL and reason are required.' });
    }

    let cleanUrl = url.trim().toLowerCase();
    try {
      const parsed = new URL(cleanUrl);
      cleanUrl = parsed.hostname;
    } catch(e) {}

    if (mongoose.connection.readyState === 1) {
      const alreadyExists = await BlockedUrl.findOne({ url: cleanUrl });
      if (alreadyExists) {
        return res.status(400).json({ success: false, message: 'URL/domain is already present on the blacklist.' });
      }

      const blocked = await BlockedUrl.create({
        url: cleanUrl,
        reason,
        addedBy: req.user.id
      });
      return res.status(201).json({ success: true, data: blocked });
    } else {
      const alreadyExists = inMemoryBlockedUrls.find(item => item.url === cleanUrl);
      if (alreadyExists) {
        return res.status(400).json({ success: false, message: 'URL/domain is already present on the blacklist.' });
      }

      const blocked = {
        _id: `mock_blacklist_id_${Date.now()}`,
        url: cleanUrl,
        reason,
        addedBy: req.user.id,
        createdAt: new Date()
      };
      inMemoryBlockedUrls.push(blocked);
      return res.status(201).json({ success: true, data: blocked });
    }
  } catch (error) {
    console.error('Add blacklist error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to add URL to blacklist.' });
  }
};

/**
 * @desc    Remove a URL from the global blacklist
 * @route   DELETE /api/admin/blacklist/:id
 * @access  Private/Admin
 */
export const removeBlacklistedUrl = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const blocked = await BlockedUrl.findById(req.params.id);
      if (!blocked) {
        return res.status(404).json({ success: false, message: 'Blacklist entry not found.' });
      }
      await blocked.deleteOne();
      return res.status(200).json({ success: true, message: 'URL removed from blacklist successfully.' });
    } else {
      const index = inMemoryBlockedUrls.findIndex(item => item._id.toString() === req.params.id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Blacklist entry not found.' });
      }
      inMemoryBlockedUrls.splice(index, 1);
      return res.status(200).json({ success: true, message: 'URL removed from blacklist successfully.' });
    }
  } catch (error) {
    console.error('Remove blacklist error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete blacklist entry.' });
  }
};
