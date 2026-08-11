const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
    },
    image: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    displayOrder: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            if (ret.image && typeof ret.image === 'string') {
                ret.image = { url: ret.image };
            }
            return ret;
        }
    }
});

module.exports = mongoose.model('Category', categorySchema);
