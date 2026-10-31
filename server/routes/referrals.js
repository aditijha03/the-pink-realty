const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { z } = require('zod');
const Referral = require('../models/Referral');
const { referralsLimiter } = require('../middleware/rateLimit');

const hashIp = (ip) => {
  return crypto.createHash('sha256').update(ip).digest('hex');
};

const cleanPhone = (val) => {
  if (!val) return '';
  return String(val).replace(/[\s\-()]/g, '');
};

const indianPhoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

const referralSchema = z.discriminatedUnion('type', [
  // Mode: refer a client
  z.object({
    type: z.literal('referral'),
    referrerName: z.string().trim().min(2, 'Referrer name must be at least 2 characters'),
    referrerPhone: z.string().trim().refine((val) => indianPhoneRegex.test(cleanPhone(val)), {
      message: 'Please provide a valid Indian mobile number for referrer'
    }),
    referrerEmail: z.string().trim().email('Please provide a valid email address'),
    referrerCity: z.string().trim().min(2, 'Referrer city is required'),
    referrerType: z.enum(['Individual', 'Agent or consultant', 'Builder or developer', 'Other'], {
      errorMap: () => ({ message: 'Please select a valid referrer category' })
    }),
    company: z.string().trim().optional().default(''),
    clientName: z.string().trim().min(2, 'Client name must be at least 2 characters'),
    clientPhone: z.string().trim().refine((val) => indianPhoneRegex.test(cleanPhone(val)), {
      message: 'Please provide a valid Indian mobile number for referred client'
    }),
    requirement: z.enum(['Buy', 'Sell', 'Rent', 'Home loan', 'Other'], {
      errorMap: () => ({ message: 'Please select a valid property requirement' })
    }),
    location: z.string().trim().min(2, 'Preferred location is required'),
    budget: z.string().trim().optional().default(''),
    note: z.string().trim().optional().default(''),
    message: z.string().trim().optional().default(''),
    website: z.string().optional().default(''), // Honeypot field
  }),
  // Mode: become a partner
  z.object({
    type: z.literal('partner'),
    referrerName: z.string().trim().min(2, 'Partner name must be at least 2 characters'),
    referrerPhone: z.string().trim().refine((val) => indianPhoneRegex.test(cleanPhone(val)), {
      message: 'Please provide a valid Indian mobile number for partner'
    }),
    referrerEmail: z.string().trim().email('Please provide a valid email address'),
    referrerCity: z.string().trim().min(2, 'Partner city is required'),
    referrerType: z.enum(['Individual', 'Agent or consultant', 'Builder or developer', 'Other'], {
      errorMap: () => ({ message: 'Please select a valid partner category' })
    }),
    company: z.string().trim().optional().default(''),
    clientName: z.string().trim().optional().default(''),
    clientPhone: z.string().trim().optional().default(''),
    requirement: z.string().trim().optional().default(''),
    location: z.string().trim().optional().default(''),
    budget: z.string().trim().optional().default(''),
    note: z.string().trim().optional().default(''),
    message: z.string().trim().min(5, 'Collaboration message must be at least 5 characters'),
    website: z.string().optional().default(''), // Honeypot field
  })
]);

router.post('/', referralsLimiter, async (req, res) => {
  try {
    // 1. Honeypot check
    if (req.body.website && String(req.body.website).trim() !== '') {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Invalid submission'
      });
    }

    // 2. Zod validation
    const parsed = referralSchema.safeParse(req.body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return res.status(400).json({
        success: false,
        data: null,
        error: issue ? issue.message : 'Validation failed'
      });
    }

    const data = parsed.data;
    const ipHash = hashIp(req.ip || req.connection.remoteAddress || 'unknown');

    let isDuplicate = false;
    let duplicateReason = '';

    // 3. Duplicate guard for client referrals within last 90 days
    if (data.type === 'referral' && data.clientPhone) {
      const cleanedClientDigits = cleanPhone(data.clientPhone).slice(-10);
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

      const existingRecent = await Referral.findOne({
        type: 'referral',
        createdAt: { $gte: ninetyDaysAgo },
        clientPhone: { $regex: new RegExp(cleanedClientDigits + '$') }
      });

      if (existingRecent) {
        isDuplicate = true;
        duplicateReason = `Possible duplicate: this client number was already referred on ${existingRecent.createdAt.toISOString().split('T')[0]}`;
      }
    }

    // 4. Create record
    const referral = await Referral.create({
      type: data.type,
      referrerName: data.referrerName,
      referrerPhone: data.referrerPhone,
      referrerEmail: data.referrerEmail,
      referrerCity: data.referrerCity,
      referrerType: data.referrerType,
      company: data.company || '',
      clientName: data.clientName || '',
      clientPhone: data.clientPhone || '',
      requirement: data.requirement || '',
      location: data.location || '',
      budget: data.budget || '',
      note: data.note || '',
      message: data.message || '',
      status: 'new',
      isDuplicate,
      duplicateReason,
      ipHash
    });

    return res.status(201).json({
      success: true,
      data: referral,
      error: null
    });
  } catch (err) {
    console.error('Error submitting referral:', err);
    return res.status(500).json({
      success: false,
      data: null,
      error: 'An unexpected error occurred. Please try again later.'
    });
  }
});

module.exports = router;
