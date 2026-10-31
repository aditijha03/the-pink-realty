const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['referral', 'partner'],
    required: true,
  },
  referrerName: {
    type: String,
    required: true,
    trim: true,
  },
  referrerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  referrerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  referrerCity: {
    type: String,
    required: true,
    trim: true,
  },
  referrerType: {
    type: String,
    enum: ['Individual', 'Agent or consultant', 'Builder or developer', 'Other'],
    required: true,
  },
  company: {
    type: String,
    trim: true,
    default: '',
  },
  clientName: {
    type: String,
    trim: true,
    default: '',
  },
  clientPhone: {
    type: String,
    trim: true,
    default: '',
  },
  requirement: {
    type: String,
    enum: ['Buy', 'Sell', 'Rent', 'Home loan', 'Other', ''],
    default: '',
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  budget: {
    type: String,
    trim: true,
    default: '',
  },
  note: {
    type: String,
    trim: true,
    default: '',
  },
  message: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'deal_closed', 'payout_pending', 'paid', 'rejected'],
    default: 'new',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  rewardAmount: {
    type: Number,
    default: null,
  },
  paidAt: {
    type: Date,
    default: null,
  },
  isDuplicate: {
    type: Boolean,
    default: false,
  },
  duplicateReason: {
    type: String,
    default: '',
  },
  ipHash: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Index for search, sorting and duplicate check queries
referralSchema.index({ type: 1, status: 1 });
referralSchema.index({ clientPhone: 1, createdAt: -1 });
referralSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Referral', referralSchema);
