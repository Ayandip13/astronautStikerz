const mongoose = require('mongoose');

const designRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional if guest user
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    designId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Design',
        required: true,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'fulfilled', 'rejected'],
        default: 'pending',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DesignRequest', designRequestSchema);
