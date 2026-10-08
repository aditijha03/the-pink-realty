require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const enquiriesRoutes = require('./routes/enquiries');

const app = express();

app.use((req, res, next) => {
  if (process.env.SITE_ENV === 'staging') {
    res.setHeader('X-Robots-Tag', 'noindex');
  }
  next();
});

if (process.env.NODE_ENV === 'production') {
  const requiredEnvs = [
    'MONGODB_URI', // also support MONGO_URI below
    'CLIENT_ORIGIN',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];
  
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error("FATAL ERROR: JWT_SECRET must be at least 32 characters in production.");
    process.exit(1);
  }

  // Handle MONGO_URI vs MONGODB_URI
  if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    console.error("FATAL ERROR: MONGODB_URI is missing.");
    process.exit(1);
  }

  requiredEnvs.slice(1).forEach(env => {
    if (!process.env[env]) {
      console.error(`FATAL ERROR: ${env} is missing.`);
      process.exit(1);
    }
  });
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_ORIGIN : (process.env.CLIENT_ORIGIN || 'http://localhost:5173'),
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

const { globalLimiter } = require('./middleware/rateLimit');

// Trust proxy to get correct IP behind Vercel/Render
const trustProxyHops = parseInt(process.env.TRUST_PROXY_HOPS || '1', 10);
app.set('trust proxy', trustProxyHops);

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`[Prod IP Log] Path: ${req.path}, IP: ${req.ip}, IPs: ${JSON.stringify(req.ips)}`);
    next();
  });
}

app.use(globalLimiter);

const uploadRoutes = require('./routes/upload');

// CSRF Protection Middleware
const csrfProtection = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const xRequestedWith = req.headers['x-requested-with'];
    if (xRequestedWith !== 'XMLHttpRequest') {
      return res.status(403).json({ success: false, message: 'CSRF validation failed: Missing or invalid X-Requested-With header' });
    }
    const origin = req.headers.origin || req.headers.referer;
    const clientOrigin = process.env.NODE_ENV === 'production' ? process.env.CLIENT_ORIGIN : (process.env.CLIENT_ORIGIN || 'http://localhost:5173');
    if (!origin || !origin.startsWith(clientOrigin)) {
      return res.status(403).json({ success: false, message: 'CSRF validation failed: Invalid Origin/Referer' });
    }
  }
  next();
};

app.use('/api', csrfProtection);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/upload', uploadRoutes); // Use it under admin
app.use('/api/public', publicRoutes);
app.use('/api/enquiries', enquiriesRoutes);

// Custom Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Database and Server
const PORT = process.env.PORT || 5000;
const dbUri = process.env.NODE_ENV === 'production' 
  ? (process.env.MONGODB_URI || process.env.MONGO_URI)
  : (process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/pinkrealty');

mongoose.connect(dbUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
