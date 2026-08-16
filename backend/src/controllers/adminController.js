const Product = require('../models/Product');
const Order = require('../models/Order');
const axios = require('axios');

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
            .select('name stock price images')
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

// @desc    Check catalog products and image delivery health
// @route   GET /api/admin/products-health
// @access  Private/Admin
const getProductsHealth = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        const report = [];

        for (const p of products) {
            const issues = [];
            const checkedImages = [];

            if (!p.images || p.images.length === 0) {
                issues.push('No images uploaded for this product.');
            } else {
                for (let i = 0; i < p.images.length; i++) {
                    const img = p.images[i];
                    const imgIndex = i;
                    const imgIssues = [];
                    
                    if (!img.url) {
                        imgIssues.push('Image url is missing or empty.');
                    } else {
                        // Check if it is a relative path starting with /uploads
                        if (img.url.startsWith('/uploads')) {
                            imgIssues.push('Image uses local relative path (ephemeral filesystem storage).');
                        } else if (img.url.startsWith('http://localhost') || img.url.startsWith('https://localhost')) {
                            imgIssues.push('Image points to development localhost.');
                        } else if (img.url.includes('res.cloudinary.com')) {
                            if (!img.publicId) {
                                imgIssues.push('Cloudinary image is missing publicId reference.');
                            }
                        }

                        // Ping the image URL
                        if (img.url.startsWith('http')) {
                            try {
                                const response = await axios.head(img.url, { timeout: 2000 });
                                if (response.status !== 200) {
                                    imgIssues.push(`Image URL returned status code: ${response.status}`);
                                }
                            } catch (err) {
                                imgIssues.push(`Image URL is unreachable: ${err.message}`);
                            }
                        } else if (img.url.startsWith('/uploads')) {
                            // Verify relative local file existence
                            const fs = require('fs');
                            const path = require('path');
                            const localFilePath = path.join(__dirname, '../../..', img.url);
                            if (!fs.existsSync(localFilePath)) {
                                imgIssues.push('Local file is missing on server disk (404).');
                            }
                        }
                    }

                    if (imgIssues.length > 0) {
                        issues.push(`Image #${imgIndex + 1} (${img.url || 'No URL'}): ${imgIssues.join(', ')}`);
                    }

                    checkedImages.push({
                        url: img.url,
                        publicId: img.publicId,
                        isHealthy: imgIssues.length === 0,
                        issues: imgIssues
                    });
                }
            }

            report.push({
                productId: p._id,
                name: p.name,
                slug: p.slug,
                category: p.category?.name || 'Uncategorized',
                imagesCount: p.images?.length || 0,
                isHealthy: issues.length === 0,
                issues,
                images: checkedImages
            });
        }

        res.json({
            status: 'success',
            checkedCount: products.length,
            unhealthyCount: report.filter(r => !r.isHealthy).length,
            report
        });
    } catch (error) {
        console.error('Products Health Check Error:', error);
        res.status(500).json({ message: 'Failed to run products health check' });
    }
};

module.exports = {
    getDashboardStats,
    getProductsHealth
};
