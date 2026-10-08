const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

const { publicLimiter } = require('../middleware/rateLimit');

router.use(publicLimiter);

router.get('/properties', async (req, res) => {
  try {
    let query = { showOnWebsite: true };
    if (req.query.isPremium === 'true') {
      query.isPremium = true;
    }
    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/properties/:slug', async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug, showOnWebsite: true });
    if (!property) return res.status(404).json({ message: 'Not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
