const express = require('express');
const router = express.Router();
// CORRECTED: The path now points to '../models/products.js' to match your file structure.
const Product = require('../models/products');
// CORRECTED: Ensuring the casing matches the actual filename 'allProducts.js'.
const allProductsData = require('../data/allProducts');

const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('No products found. Seeding database...');
      await Product.insertMany(allProductsData);
      console.log('Database seeded successfully with 50 products.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
