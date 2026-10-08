

const mongoose = require('mongoose');
const Counter = require('./Counter');

const propertySchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  slug: { type: String, unique: true },
  title: { type: String, required: true },
  listingType: { type: String, enum: ['sale', 'rent'], default: 'sale' },
  propertyType: { type: String, default: 'apartment' },
  constructionStatus: { type: String, default: 'Ready to move' },
  furnishing: { type: String, default: 'Unfurnished' },
  price: { type: Number, required: true },
  location: { type: String },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  parking: { type: Number },
  areaSqft: { type: Number },
  description: { type: String },
  amenities: [String],
  featured: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  showOnWebsite: { type: Boolean, default: false },
  images: [{ url: String, publicId: String, isCover: Boolean }],
  status: { type: String, default: 'draft' }
}, { timestamps: true });

// Auto-generate reference number like PR-001
propertySchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: 'propertyReference' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.reference = `PR-${String(counter.seq).padStart(3, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  
  if (this.isModified('title')) {
    // Basic slug generation
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
  }
  
  next();
});

module.exports = mongoose.model('Property', propertySchema);
