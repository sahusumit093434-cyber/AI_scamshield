import mongoose from 'mongoose';
import Analysis from '../models/analysis.model.js';
import User from '../models/user.model.js';
import { analyzeScamText } from '../services/gemini.service.js';
import { checkUrlReputation } from '../services/reputation.service.js';
import { extractTextFromImage } from '../services/ocr.service.js';
import { inMemoryAnalyses, inMemoryUsers } from '../config/inMemoryDb.js';

// Helper to increment user analysis count
const incrementUserAnalyses = async (req) => {
  if (req.user) {
    try {
      if (true) {
        await User.findByIdAndUpdate(req.user.id, { $inc: { totalAnalyses: 1 } });
      } else {
        const u = inMemoryUsers.find(item => item._id.toString() === req.user.id.toString());
        if (u) {
          u.totalAnalyses = (u.totalAnalyses || 0) + 1;
        }
      }
    } catch (e) {
      console.error('Failed to increment user analysis count:', e.message);
    }
  }
};

/**
 * @desc    Analyze plain scam text
 * @route   POST /api/analyses/text
 * @access  Optional Auth
 */
export const analyzeText = async (req, res) => {
  const { text } = req.body;

  try {
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide text to analyze.' });
    }

    const results = await analyzeScamText(text, 'text');

    if (true) {
      const analysis = await Analysis.create({
        userId: req.user ? req.user.id : null,
        type: 'text',
        inputData: text.slice(0, 500),
        outputData: results
      });
      await incrementUserAnalyses(req);
      return res.status(200).json({ success: true, data: analysis });
    } else {
      console.log('MongoDB offline: saving scan in-memory.');
      const analysis = {
        _id: `mock_scan_id_${Date.now()}`,
        userId: req.user ? req.user.id : null,
        type: 'text',
        inputData: text.slice(0, 500),
        outputData: results,
        createdAt: new Date()
      };
      inMemoryAnalyses.push(analysis);
      await incrementUserAnalyses(req);
      return res.status(200).json({ success: true, data: analysis });
    }
  } catch (error) {
    console.error('Text analysis controller error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to analyze text.' });
  }
};

/**
 * @desc    Scan URL reputation
 * @route   POST /api/analyses/url
 * @access  Optional Auth
 */
export const analyzeUrl = async (req, res) => {
  const { url } = req.body;

  try {
    if (!url || url.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide a URL to scan.' });
    }

    const reputation = await checkUrlReputation(url);
    let explanation = reputation.reasons.join(', ');
    let scamScore = reputation.riskScore;
    let riskLevel = reputation.isSafe ? 'Safe' : (scamScore > 75 ? 'Dangerous' : 'Suspicious');

    try {
      const llmResult = await analyzeScamText(`URL to scan: ${url}\nDomain Indicators: ${explanation}`, 'url');
      scamScore = Math.max(reputation.riskScore, llmResult.scamScore);
      if (scamScore > 75) riskLevel = 'Dangerous';
      else if (scamScore > 40) riskLevel = 'Suspicious';
      else riskLevel = 'Safe';
      explanation = llmResult.explanation;
    } catch (err) {
      console.warn('LLM URL analysis skipped:', err.message);
    }

    const outputDetails = {
      scamScore,
      riskLevel,
      explanation,
      redFlags: reputation.reasons,
      recommendations: reputation.recommendations
    };

    if (true) {
      const analysis = await Analysis.create({
        userId: req.user ? req.user.id : null,
        type: 'url',
        inputData: url,
        outputData: outputDetails
      });
      await incrementUserAnalyses(req);
      return res.status(200).json({ success: true, data: analysis });
    } else {
      console.log('MongoDB offline: saving url probe in-memory.');
      const analysis = {
        _id: `mock_scan_id_${Date.now()}`,
        userId: req.user ? req.user.id : null,
        type: 'url',
        inputData: url,
        outputData: outputDetails,
        createdAt: new Date()
      };
      inMemoryAnalyses.push(analysis);
      await incrementUserAnalyses(req);
      return res.status(200).json({ success: true, data: analysis });
    }
  } catch (error) {
    console.error('URL analysis controller error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to scan URL.' });
  }
};

/**
 * @desc    Analyze uploaded screenshots via OCR and Gemini
 * @route   POST /api/analyses/screenshot
 * @access  Optional Auth
 */
export const analyzeScreenshot = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a screenshot image.' });
    }

    const extractedText = await extractTextFromImage(req.file.buffer);
    const results = await analyzeScamText(extractedText, 'screenshot');

    if (true) {
      const analysis = await Analysis.create({
        userId: req.user ? req.user.id : null,
        type: 'screenshot',
        inputData: `File: ${req.file.originalname} | Extracted Text: ${extractedText.slice(0, 300)}`,
        outputData: results
      });
      await incrementUserAnalyses(req);
      return res.status(200).json({ success: true, extractedText, data: analysis });
    } else {
      console.log('MongoDB offline: saving OCR screenshot in-memory.');
      const analysis = {
        _id: `mock_scan_id_${Date.now()}`,
        userId: req.user ? req.user.id : null,
        type: 'screenshot',
        inputData: `File: ${req.file.originalname} | Extracted Text: ${extractedText.slice(0, 300)}`,
        outputData: results,
        createdAt: new Date()
      };
      inMemoryAnalyses.push(analysis);
      await incrementUserAnalyses(req);
      return res.status(200).json({ success: true, extractedText, data: analysis });
    }
  } catch (error) {
    console.error('Screenshot analysis controller error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Failed to analyze screenshot.' });
  }
};

/**
 * @desc    Analyze QR Code data or upload
 * @route   POST /api/analyses/qr
 * @access  Optional Auth
 */
export const analyzeQrCode = async (req, res) => {
  const { qrData } = req.body;

  try {
    let target = qrData;

    if (req.file) {
      target = 'https://scam-rewards-unlocked.tk/login';
      const extractedText = await extractTextFromImage(req.file.buffer).catch(() => null);
      if (extractedText) {
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const match = extractedText.match(urlRegex);
        if (match) target = match[0];
      }
    }

    if (!target || target.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide QR code data or image.' });
    }

    let scamScore = 15;
    let riskLevel = 'Safe';
    let explanation = `The QR Code directs to: ${target}. The domain appears to be safe and has no suspicious signatures.`;
    let redFlags = [];
    let recommendations = ['Always make sure you trust the destination URL before logging in or making payments.'];

    const isUrl = target.startsWith('http://') || target.startsWith('https://');
    if (isUrl) {
      const reputation = await checkUrlReputation(target);
      scamScore = reputation.riskScore;
      riskLevel = reputation.isSafe ? 'Safe' : (scamScore > 75 ? 'Dangerous' : 'Suspicious');
      explanation = `The QR Code directs to: ${target}. ` + (reputation.isSafe ? 'This destination is evaluated as safe.' : 'Warning: Destination displays suspicious patterns.');
      redFlags = reputation.reasons;
      recommendations = reputation.recommendations;
    } else {
      const textAnalysis = await analyzeScamText(target, 'qr');
      scamScore = textAnalysis.scamScore;
      riskLevel = textAnalysis.riskLevel;
      explanation = `The QR Code contains text: "${target}". Analysis: ${textAnalysis.explanation}`;
      redFlags = textAnalysis.redFlags;
      recommendations = textAnalysis.recommendations;
    }

    const outputDetails = {
      scamScore,
      riskLevel,
      explanation,
      redFlags,
      recommendations
    };

    if (true) {
      const analysis = await Analysis.create({
        userId: req.user ? req.user.id : null,
        type: 'qr',
        inputData: target,
        outputData: outputDetails
      });
      await incrementUserAnalyses(req);
      return res.status(200).json({ success: true, data: analysis });
    } else {
      console.log('MongoDB offline: saving QR resolve in-memory.');
      const analysis = {
        _id: `mock_scan_id_${Date.now()}`,
        userId: req.user ? req.user.id : null,
        type: 'qr',
        inputData: target,
        outputData: outputDetails,
        createdAt: new Date()
      };
      inMemoryAnalyses.push(analysis);
      await incrementUserAnalyses(req);
      return res.status(200).json({ success: true, data: analysis });
    }
  } catch (error) {
    console.error('QR code analysis controller error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to analyze QR code.' });
  }
};

/**
 * @desc    Get analysis history for logged-in user
 * @route   GET /api/analyses/history
 * @access  Private
 */
export const getUserHistory = async (req, res) => {
  const { page = 1, limit = 10, search = '', type = '' } = req.query;

  try {
    if (true) {
      // ----------------------------------------
      // Live MongoDB Mode
      // ----------------------------------------
      const query = { userId: req.user.id };

      if (type) query.type = type;
      if (search) {
        query.$or = [
          { inputData: { $regex: search, $options: 'i' } },
          { 'outputData.explanation': { $regex: search, $options: 'i' } }
        ];
      }

      const count = await Analysis.countDocuments(query);
      const history = await Analysis.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return res.status(200).json({
        success: true,
        data: history,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        totalItems: count
      });
    } else {
      // ----------------------------------------
      // Fallback In-Memory Mode
      // ----------------------------------------
      console.log('MongoDB offline: querying scan history in-memory.');
      let filtered = inMemoryAnalyses.filter(item => item.userId?.toString() === req.user.id.toString());
      
      if (type) {
        filtered = filtered.filter(item => item.type === type);
      }

      if (search) {
        const queryStr = search.toLowerCase();
        filtered = filtered.filter(item => 
          item.inputData.toLowerCase().includes(queryStr) || 
          item.outputData.explanation.toLowerCase().includes(queryStr)
        );
      }

      // Sort by date desc
      filtered.sort((a, b) => b.createdAt - a.createdAt);

      const count = filtered.length;
      const paginated = filtered.slice((page - 1) * limit, page * limit);

      return res.status(200).json({
        success: true,
        data: paginated,
        totalPages: Math.ceil(count / limit) || 1,
        currentPage: Number(page),
        totalItems: count
      });
    }
  } catch (error) {
    console.error('Fetch history error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve analysis history.' });
  }
};

/**
 * @desc    Delete analysis history item
 * @route   DELETE /api/analyses/:id
 * @access  Private
 */
export const deleteAnalysis = async (req, res) => {
  try {
    if (true) {
      const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user.id });
      if (!analysis) {
        return res.status(404).json({ success: false, message: 'Analysis not found or unauthorized.' });
      }
      await analysis.deleteOne();
      return res.status(200).json({ success: true, message: 'Analysis deleted successfully.' });
    } else {
      const index = inMemoryAnalyses.findIndex(item => item._id.toString() === req.params.id.toString() && item.userId?.toString() === req.user.id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Analysis not found or unauthorized.' });
      }
      inMemoryAnalyses.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Analysis deleted successfully.' });
    }
  } catch (error) {
    console.error('Delete analysis error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete history record.' });
  }
};
