const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // As decided in plan, login required for custom designs
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    designState: {
        type: mongoose.Schema.Types.Mixed, // Stores the complex Fabric.js JSON object
        required: true,
    },
    previewImage: {
        type: String, // Cloudinary URL
        required: true,
    },
    assets: [{
        type: String, // Cloudinary URLs of uploaded images used in design
    }],
}, {
    timestamps: true
});

designSchema.index({ user: 1 });

module.exports = mongoose.model('Design', designSchema);
