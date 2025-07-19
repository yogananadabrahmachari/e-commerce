const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  isNew: { type: Boolean, default: false },
});

module.exports = mongoose.model('Product', productSchema);
