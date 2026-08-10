const Order = require('../models/Order');
const Product = require('../models/Product');
const crypto = require('crypto');
const Razorpay = require('razorpay');

// Optional protect middleware inline equivalent or we just check cookies manually in the controller
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getOptionalUser = async (req) => {
    let token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-passwordHash');
            if (user && user.active) {
                return user;
            }
        } catch (error) {
            // Ignore error for optional auth
        }
    }
    return null;
};

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder',
});

// @desc    Create new order & Razorpay session
// @route   POST /api/orders/checkout
// @access  Public
const createCheckoutOrder = async (req, res) => {
    try {
        const { items, shippingAddress, guestContact } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const user = await getOptionalUser(req);

        let subtotal = 0;
        const orderItems = [];

        // Validate products and calculate authoritative total
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || !product.active) {
                return res.status(400).json({ message: `Product ${item.productId} not found or inactive` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            subtotal += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
                price: product.price,
                quantity: item.quantity,
                isCustomized: item.isCustomized || false,
                designId: item.designId || null,
                previewImage: item.previewImage || null
            });
        }

        // Basic shipping logic: free over 499, else 50
        const shippingAmount = subtotal > 499 ? 0 : 50;
        const totalAmount = subtotal + shippingAmount;

        // Generate unique order number
        const orderNumber = 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);

        // Create initial pending order in DB
        const order = new Order({
            orderNumber,
            user: user ? user._id : null,
            guestContact: !user ? guestContact : undefined,
            items: orderItems,
            shippingAddress,
            subtotal,
            shippingAmount,
            totalAmount,
            paymentStatus: 'pending',
            orderStatus: 'pending'
        });

        await order.save();

        // Create Razorpay Order
        const options = {
            amount: Math.round(totalAmount * 100), // amount in the smallest currency unit (paise)
            currency: 'INR',
            receipt: order._id.toString(),
        };

        const rzpOrder = await razorpayInstance.orders.create(options);

        // Update internal order with Razorpay Order ID
        order.razorpayOrderId = rzpOrder.id;
        await order.save();

        res.status(201).json({
            orderId: order._id,
            orderNumber: order.orderNumber,
            razorpayOrderId: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
        });

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ message: 'Failed to initiate checkout', error: error.message });
    }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/orders/verify
// @access  Public
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Idempotency check
        if (order.paymentStatus === 'paid') {
            return res.status(200).json({ message: 'Payment already verified', orderId: order._id });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        
        const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder';
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is verified
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature;
            order.paymentStatus = 'paid';
            order.orderStatus = 'processing';

            // Decrement stock atomically, ensuring it doesn't go below 0 if somehow race condition happens
            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.product, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } }
                );
            }

            await order.save();

            res.status(200).json({ message: 'Payment verified successfully', orderId: order._id });
        } else {
            // Signature verification failed
            order.paymentStatus = 'failed';
            await order.save();
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: 'Failed to verify payment', error: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (Guest needs to view order success, or Private for strictly user)
// Here we'll make it Public but verify ownership if user is attached.
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const user = await getOptionalUser(req);

        // Security check: if order belongs to a user, only that user or admin can view it
        if (order.user) {
            const isOwner = user && user._id.toString() === order.user._id.toString();
            const isAdmin = user && user.role === 'admin';
            
            if (!isOwner && !isAdmin) {
                return res.status(401).json({ message: 'Not authorized to view this order' });
            }
        }
        
        // If it's a guest order, anyone with the ID can view it (for the success page).
        // For production, maybe require an email match or token. We'll allow it for now.

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch order details' });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 12;
        const page = Number(req.query.page) || 1;

        let query = {};
        
        if (req.query.keyword) {
            query.orderNumber = {
                $regex: req.query.keyword,
                $options: 'i',
            };
        }

        if (req.query.paymentStatus) {
            query.paymentStatus = req.query.paymentStatus;
        }

        if (req.query.orderStatus) {
            query.orderStatus = req.query.orderStatus;
        }

        const count = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            orders,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        console.error('Fetch all orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus, courier, trackingNumber, trackingUrl } = req.body;
        
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        
        if (courier !== undefined) order.shippingDetails = { ...order.shippingDetails, courier };
        if (trackingNumber !== undefined) order.shippingDetails = { ...order.shippingDetails, trackingNumber };
        if (trackingUrl !== undefined) order.shippingDetails = { ...order.shippingDetails, trackingUrl };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};

module.exports = {
    createCheckoutOrder,
    verifyPayment,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
