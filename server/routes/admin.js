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
const Referral = require('../models/Referral');

router.get('/dashboard', async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const featuredProperties = await Property.countDocuments({ featured: true });
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' });
    const totalReferrals = await Referral.countDocuments();
    const newReferrals = await Referral.countDocuments({ status: 'new' });

    const recentProperties = await Property.find().sort({ createdAt: -1 }).limit(5).select('title location price propertyType status images');
    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalProperties,
          featuredProperties,
          totalEnquiries,
          newEnquiries,
          totalReferrals,
          newReferrals
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

router.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
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

// --- Referrals Admin Routes ---

// CSV Export
router.get('/referrals/export.csv', async (req, res) => {
  try {
    const referrals = await Referral.find().sort({ createdAt: -1 });

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const headers = [
      'ID',
      'Date',
      'Type',
      'Referrer Name',
      'Referrer Phone',
      'Referrer Email',
      'Referrer City',
      'Referrer Category',
      'Company',
      'Client Name',
      'Client Phone',
      'Requirement',
      'Preferred Location',
      'Budget',
      'Note',
      'Partner Message',
      'Status',
      'Possible Duplicate',
      'Admin Notes',
      'Reward Amount',
      'Paid At'
    ];

    const rows = referrals.map(r => [
      escapeCsv(r._id),
      escapeCsv(r.createdAt ? r.createdAt.toISOString() : ''),
      escapeCsv(r.type),
      escapeCsv(r.referrerName),
      escapeCsv(r.referrerPhone),
      escapeCsv(r.referrerEmail),
      escapeCsv(r.referrerCity),
      escapeCsv(r.referrerType),
      escapeCsv(r.company),
      escapeCsv(r.clientName),
      escapeCsv(r.clientPhone),
      escapeCsv(r.requirement),
      escapeCsv(r.location),
      escapeCsv(r.budget),
      escapeCsv(r.note),
      escapeCsv(r.message),
      escapeCsv(r.status),
      escapeCsv(r.isDuplicate ? 'YES' : 'NO'),
      escapeCsv(r.adminNotes),
      escapeCsv(r.rewardAmount != null ? r.rewardAmount : ''),
      escapeCsv(r.paidAt ? r.paidAt.toISOString() : '')
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="referrals-export-${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Count of new referrals for sidebar badge
router.get('/referrals/count', async (req, res) => {
  try {
    const newCount = await Referral.countDocuments({ status: 'new' });
    const totalCount = await Referral.countDocuments();
    res.json({ success: true, data: { newCount, totalCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// List referrals with filters, search, and pagination
router.get('/referrals', async (req, res) => {
  try {
    const { search, status, type, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (search && String(search).trim() !== '') {
      const regex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { referrerName: regex },
        { referrerPhone: regex },
        { referrerEmail: regex },
        { referrerCity: regex },
        { clientName: regex },
        { clientPhone: regex },
        { company: regex },
        { location: regex }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [referrals, total, newCount] = await Promise.all([
      Referral.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Referral.countDocuments(query),
      Referral.countDocuments({ status: 'new' })
    ]);

    res.json({
      success: true,
      data: {
        referrals,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        newCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single referral
router.get('/referrals/:id', async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
    res.json({ success: true, data: referral });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update referral (status, adminNotes, rewardAmount, paidAt)
router.patch('/referrals/:id', async (req, res) => {
  try {
    const { status, adminNotes, rewardAmount, paidAt } = req.body;
    const update = {};

    if (status !== undefined) {
      const validStatuses = ['new', 'contacted', 'in_progress', 'deal_closed', 'payout_pending', 'paid', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
      }
      update.status = status;
      // Auto-set paidAt if status changed to paid and paidAt not explicitly provided
      if (status === 'paid' && paidAt === undefined) {
        update.paidAt = new Date();
      }
    }

    if (adminNotes !== undefined) {
      update.adminNotes = String(adminNotes);
    }

    if (rewardAmount !== undefined) {
      update.rewardAmount = rewardAmount === '' || rewardAmount === null ? null : Number(rewardAmount);
    }

    if (paidAt !== undefined) {
      update.paidAt = paidAt ? new Date(paidAt) : null;
    }

    const referral = await Referral.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });

    res.json({ success: true, data: referral });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete referral
router.delete('/referrals/:id', async (req, res) => {
  try {
    const referral = await Referral.findByIdAndDelete(req.params.id);
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
    res.json({ success: true, message: 'Referral deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
