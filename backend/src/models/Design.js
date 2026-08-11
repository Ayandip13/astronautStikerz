const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Making user optional allows guest users to upload designs.
        // We can enforce authentication at checkout if needed.
        required: false, 
    },
    imageUrl: {
        type: String, // Cloudinary URL of the uploaded base artwork
        required: true,
    },
    name: {
        type: String, // Optional name, e.g. original filename
    }
}, {
    timestamps: true
});

designSchema.index({ user: 1 });

module.exports = mongoose.model('Design', designSchema);
