const express = require('express');
const router = express.Router();
const { getDashboardStats, getProductsHealth } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/products-health', protect, admin, getProductsHealth);

module.exports = router;
