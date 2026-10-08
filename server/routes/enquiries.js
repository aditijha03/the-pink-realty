const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Enquiry = require('../models/Enquiry');

const hashIp = (ip) => {
  return crypto.createHash('sha256').update(ip).digest('hex');
};

const { enquiriesLimiter } = require('../middleware/rateLimit');

router.post('/', enquiriesLimiter, async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;
    const ipHash = hashIp(req.ip || req.connection.remoteAddress || 'unknown');

    const enquiry = await Enquiry.create({
      propertyId,
      name,
      email,
      phone,
      message,
      ipHash
    });

    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
