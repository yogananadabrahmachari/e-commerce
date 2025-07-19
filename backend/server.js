const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/', (req, res) => {
    res.send('ShopSphere API is running...');
});

// Health Check for Kubernetes Probes
app.get('/healthz', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
        res.status(200).send('OK');
    } else {
        res.status(503).send('Database not connected');
    }
});

app.use('/api/products', productRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on port: ${PORT}`);
});
