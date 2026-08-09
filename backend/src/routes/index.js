const express = require('express');
const router = express.Router();

const healthRoutes = require('./health');
const authRoutes = require('./auth');
const uploadRoutes = require('./upload');
const productRoutes = require('./products');
const categoryRoutes = require('./categories');

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
