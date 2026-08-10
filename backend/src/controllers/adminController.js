const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ active: true });
        
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
        
        // Calculate total revenue from paid or delivered orders
        const orders = await Order.find({ paymentStatus: 'paid' });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Recent orders (last 5)
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);
            
        // Low stock products (less than 10)
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
            .select('name stock price image')
            .limit(5);

        res.json({
            totalProducts,
            activeProducts,
            totalOrders,
            pendingOrders,
            paidOrders,
            totalRevenue,
            recentOrders,
            lowStockProducts
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
};

module.exports = {
    getDashboardStats
};
