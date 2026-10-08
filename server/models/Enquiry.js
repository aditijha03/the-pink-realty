const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new' },
  ipHash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
