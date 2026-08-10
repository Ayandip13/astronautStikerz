const express = require('express');
const router = express.Router();
const {
    createCheckoutOrder,
    verifyPayment,
    getMyOrders,
    getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/checkout', createCheckoutOrder);
router.post('/verify', verifyPayment);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
