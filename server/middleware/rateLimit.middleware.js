import rateLimit from 'express-rate-limit';

/**
 * General API request limiter
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max 200 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Authentication rate limiter (login / register)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 attempts
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Scanner rate limiter (to prevent abuse of AI & OCR credits)
 */
export const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 scans
  message: {
    success: false,
    message: 'Scam scanning limits reached. Please slow down and try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
