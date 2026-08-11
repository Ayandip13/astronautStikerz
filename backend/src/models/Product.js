const mongoose = require('mongoose');

const customizationConfigSchema = new mongoose.Schema({
    enabled: { type: Boolean, default: false },
    canvasWidth: { type: Number },
    canvasHeight: { type: Number },
    printableArea: {
        x: { type: Number },
        y: { type: Number },
        width: { type: Number },
        height: { type: Number },
    },
    allowedImageTypes: [{ type: String }],
    maxImageSizeMB: { type: Number },
    allowText: { type: Boolean, default: true },
    allowImageMovement: { type: Boolean, default: true },
    allowResizing: { type: Boolean, default: true },
    allowRotation: { type: Boolean, default: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    compareAtPrice: {
        type: Number,
        min: 0,
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    images: [{
        type: String, // Cloudinary URLs
    }],
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    active: {
        type: Boolean,
        default: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    customizable: {
        type: Boolean,
        default: false,
    },
    customizationConfig: customizationConfigSchema,
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            if (ret.images && Array.isArray(ret.images)) {
                ret.images = ret.images.map(img => typeof img === 'string' ? { url: img } : img);
            }
            return ret;
        }
    }
});

productSchema.index({ category: 1 });
productSchema.index({ active: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema);
