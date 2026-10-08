const rateLimit = require('express-rate-limit');

const isProd = process.env.NODE_ENV === 'production';

const jsonResponse = {
  success: false,
  error: 'Too many requests, please try again later.'
};

const skipIfNotProd = (req, res) => {
  if (!isProd) return true;
  if (req.originalUrl === '/api/auth/me' && req.method === 'GET') return true;
  return false;
};

const createLimiter = (options) => {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    message: jsonResponse,
    skip: skipIfNotProd,
    handler: (req, res, next, optionsInfo) => {
      res.setHeader('Retry-After', Math.ceil(optionsInfo.windowMs / 1000));
      res.status(optionsInfo.statusCode).json(optionsInfo.message);
    },
    ...options
  });
};

// Global limiter: 1000 requests per 15 minutes per IP
const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
});

// POST /api/auth/login: 10 failed attempts per 15 min per IP
const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
});

// POST /api/enquiries: 5 per hour per IP
const enquiriesLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
});

// Admin routes: 300 per 15 min, keyed by user id where authenticated
const adminLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  keyGenerator: (req) => {
    // If authenticated, use user ID, otherwise fallback to IP
    return (req.user && req.user._id) ? req.user._id.toString() : req.ip;
  }
});

// Public GET routes: 300 per 15 min
const publicLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
});

module.exports = {
  globalLimiter,
  loginLimiter,
  enquiriesLimiter,
  adminLimiter,
  publicLimiter
};
