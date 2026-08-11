const express = require('express');
const router = express.Router();

const healthRoutes = require('./health');
const authRoutes = require('./auth');
const uploadRoutes = require('./upload');
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const orderRoutes = require('./orders');
const designRoutes = require('./designs');
const designRequestRoutes = require('./designRequests');
const adminRoutes = require('./admin');

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/designs', designRoutes);
router.use('/design-requests', designRequestRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
