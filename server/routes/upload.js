const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const { adminLimiter } = require('../middleware/rateLimit');
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protect);
router.use(adminLimiter);

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'the-pink-realty' },
    (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
      res.json({ success: true, data: { url: result.secure_url, publicId: result.public_id } });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

module.exports = router;
