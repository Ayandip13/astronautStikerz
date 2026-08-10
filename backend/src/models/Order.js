const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    // Prepared for Phase 5
    isCustomized: { type: Boolean, default: false },
    designId: { type: String },
    previewImage: { type: String }
});

const shippingAddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true, default: 'India' }
});

const shippingDetailsSchema = new mongoose.Schema({
    courier: { type: String },
    trackingNumber: { type: String },
    trackingUrl: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Optional because guest checkout is allowed
    },
    guestContact: {
        name: String,
        email: String,
        phone: String
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    shippingDetails: shippingDetailsSchema,
    
    subtotal: { type: Number, required: true },
    shippingAmount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
