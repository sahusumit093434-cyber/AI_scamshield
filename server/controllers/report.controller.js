import mongoose from 'mongoose';
import Report from '../models/report.model.js';
import User from '../models/user.model.js';
import { inMemoryReports, inMemoryUsers } from '../config/inMemoryDb.js';

/**
 * @desc    Create a new community scam report
 * @route   POST /api/reports
 * @access  Private
 */
export const createReport = async (req, res) => {
  const { title, description, website, phoneNumber, upiId } = req.body;

  try {
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    let screenshotUrl = '';
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      screenshotUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    if (mongoose.connection.readyState === 1) {
      const report = await Report.create({
        userId: req.user.id,
        username: req.user.name,
        title,
        description,
        screenshotUrl,
        website: website || '',
        phoneNumber: phoneNumber || '',
        upiId: upiId || '',
        upvotes: [],
        comments: []
      });
      await User.findByIdAndUpdate(req.user.id, { $inc: { totalReports: 1 } });
      return res.status(201).json({ success: true, data: report });
    } else {
      console.log('MongoDB offline: saving community report in-memory.');
      const report = {
        _id: `mock_report_id_${Date.now()}`,
        userId: req.user.id,
        username: req.user.name,
        title,
        description,
        screenshotUrl,
        website: website || '',
        phoneNumber: phoneNumber || '',
        upiId: upiId || '',
        upvotes: [],
        comments: [],
        createdAt: new Date()
      };
      inMemoryReports.push(report);
      
      const u = inMemoryUsers.find(item => item._id.toString() === req.user.id.toString());
      if (u) {
        u.totalReports = (u.totalReports || 0) + 1;
      }
      
      return res.status(201).json({ success: true, data: report });
    }
  } catch (error) {
    console.error('Create report error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create community report.' });
  }
};

/**
 * @desc    Get all community reports (with search and filters)
 * @route   GET /api/reports
 * @access  Public
 */
export const getReports = async (req, res) => {
  const { search = '', filterType = '' } = req.query;

  try {
    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { website: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
          { upiId: { $regex: search, $options: 'i' } }
        ];
      }

      if (filterType === 'phone') {
        query.phoneNumber = { $ne: '' };
      } else if (filterType === 'upi') {
        query.upiId = { $ne: '' };
      } else if (filterType === 'website') {
        query.website = { $ne: '' };
      }

      const reports = await Report.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: reports });
    } else {
      console.log('MongoDB offline: querying community reports in-memory.');
      let filtered = [...inMemoryReports];

      if (search) {
        const queryStr = search.toLowerCase();
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(queryStr) ||
          item.description.toLowerCase().includes(queryStr) ||
          item.website.toLowerCase().includes(queryStr) ||
          item.phoneNumber.toLowerCase().includes(queryStr) ||
          item.upiId.toLowerCase().includes(queryStr)
        );
      }

      if (filterType === 'phone') {
        filtered = filtered.filter(item => item.phoneNumber !== '');
      } else if (filterType === 'upi') {
        filtered = filtered.filter(item => item.upiId !== '');
      } else if (filterType === 'website') {
        filtered = filtered.filter(item => item.website !== '');
      }

      filtered.sort((a, b) => b.createdAt - a.createdAt);
      return res.status(200).json({ success: true, data: filtered });
    }
  } catch (error) {
    console.error('Fetch reports error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve community reports.' });
  }
};

/**
 * @desc    Get details of a single report
 * @route   GET /api/reports/:id
 * @access  Public
 */
export const getReportById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Scam report not found.' });
      }
      return res.status(200).json({ success: true, data: report });
    } else {
      const report = inMemoryReports.find(item => item._id.toString() === req.params.id.toString());
      if (!report) {
        return res.status(404).json({ success: false, message: 'Scam report not found.' });
      }
      return res.status(200).json({ success: true, data: report });
    }
  } catch (error) {
    console.error('Get report details error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve report details.' });
  }
};

/**
 * @desc    Upvote/Downvote a scam report
 * @route   PUT /api/reports/:id/upvote
 * @access  Private
 */
export const upvoteReport = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found.' });
      }

      const upvoteIndex = report.upvotes.indexOf(req.user.id);
      if (upvoteIndex > -1) {
        report.upvotes.splice(upvoteIndex, 1);
      } else {
        report.upvotes.push(req.user.id);
      }
      await report.save();
      return res.status(200).json({ success: true, upvotesCount: report.upvotes.length, upvotes: report.upvotes });
    } else {
      const report = inMemoryReports.find(item => item._id.toString() === req.params.id.toString());
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found.' });
      }

      const upvoteIndex = report.upvotes.indexOf(req.user.id.toString());
      if (upvoteIndex > -1) {
        report.upvotes.splice(upvoteIndex, 1);
      } else {
        report.upvotes.push(req.user.id.toString());
      }
      return res.status(200).json({ success: true, upvotesCount: report.upvotes.length, upvotes: report.upvotes });
    }
  } catch (error) {
    console.error('Upvote report error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to toggle upvote.' });
  }
};

/**
 * @desc    Post comment on a report
 * @route   POST /api/reports/:id/comment
 * @access  Private
 */
export const commentOnReport = async (req, res) => {
  const { text } = req.body;

  try {
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty.' });
    }

    if (mongoose.connection.readyState === 1) {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found.' });
      }

      const comment = {
        userId: req.user.id,
        username: req.user.name,
        text: text.trim(),
        createdAt: new Date()
      };

      report.comments.push(comment);
      await report.save();
      return res.status(201).json({ success: true, data: report.comments });
    } else {
      const report = inMemoryReports.find(item => item._id.toString() === req.params.id.toString());
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found.' });
      }

      const comment = {
        _id: `mock_comment_id_${Date.now()}`,
        userId: req.user.id,
        username: req.user.name,
        text: text.trim(),
        createdAt: new Date()
      };

      report.comments.push(comment);
      return res.status(201).json({ success: true, data: report.comments });
    }
  } catch (error) {
    console.error('Add comment error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to post comment.' });
  }
};

/**
 * @desc    Delete a report (author or admin only)
 * @route   DELETE /api/reports/:id
 * @access  Private
 */
export const deleteReport = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found.' });
      }

      if (report.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this report.' });
      }

      await report.deleteOne();
      return res.status(200).json({ success: true, message: 'Report deleted successfully.' });
    } else {
      const index = inMemoryReports.findIndex(item => item._id.toString() === req.params.id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Report not found.' });
      }

      const report = inMemoryReports[index];
      if (report.userId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this report.' });
      }

      inMemoryReports.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Report deleted successfully.' });
    }
  } catch (error) {
    console.error('Delete report error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete report.' });
  }
};
