const express = require('express');
const router = express.Router();
const {
    createCheckoutOrder,
    verifyPayment,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllOrders);

router.post('/checkout', createCheckoutOrder);
router.post('/verify', verifyPayment);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', getOrderById);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

module.exports = router;
