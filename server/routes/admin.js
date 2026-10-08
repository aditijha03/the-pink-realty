const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to check admin role
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

const { adminLimiter } = require('../middleware/rateLimit');

router.use(protect);
router.use(adminLimiter);

const Property = require('../models/Property');
const Enquiry = require('../models/Enquiry');

router.get('/dashboard', async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const featuredProperties = await Property.countDocuments({ featured: true });
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' });

    const recentProperties = await Property.find().sort({ createdAt: -1 }).limit(5).select('title location price propertyType status images');
    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalProperties,
          featuredProperties,
          totalEnquiries,
          newEnquiries
        },
        recentProperties,
        recentEnquiries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/properties', async (req, res) => {
  try {
    if (req.body.isPremium === true) {
      await Property.updateMany({}, { isPremium: false });
    }
    const property = new Property(req.body);
    const saved = await property.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { properties } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/properties/:id', async (req, res) => {
  try {
    if (req.body.isPremium === true) {
      await Property.updateMany({ _id: { $ne: req.params.id } }, { isPremium: false });
    }
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { enquiries } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/enquiries/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/enquiries/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
