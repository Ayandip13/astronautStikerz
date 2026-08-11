const Design = require('../models/Design');
const Product = require('../models/Product');
const { uploadImageToCloudinary } = require('../services/uploadService');

// @desc    Create a new design
// @route   POST /api/designs
// @access  Private
const createDesign = async (req, res) => {
    try {
        // Now, this endpoint expects multipart/form-data upload.
        // It creates the Design directly from the uploaded file.
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const result = await uploadImageToCloudinary(req.file.buffer, 'astronaut-store/designs/assets');

        const design = new Design({
            user: req.user ? req.user._id : null, // Optional if we allow guest checkouts
            imageUrl: result.secure_url,
            name: req.file.originalname,
        });

        const createdDesign = await design.save();
        res.status(201).json(createdDesign);
    } catch (error) {
        console.error('Design creation error:', error);
        res.status(500).json({ message: 'Failed to upload artwork' });
    }
};

// @desc    Get a design by ID
// @route   GET /api/designs/:id
// @access  Private
const getDesignById = async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);

        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }

        // Ensure ownership or admin if the design has a user
        if (design.user) {
            if (!req.user || (design.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
                return res.status(403).json({ message: 'Not authorized to access this design' });
            }
        }

        res.status(200).json(design);
    } catch (error) {
        console.error('Fetch design error:', error);
        res.status(500).json({ message: 'Failed to fetch design' });
    }
};

// @desc    Upload an asset (artwork) to Cloudinary for design
// @route   POST /api/designs/upload
// @access  Private
// Expects multipart/form-data with an 'image' field
const uploadDesignAsset = async (req, res) => {
    try {
        const { previewImageBase64 } = req.body;
        if (!previewImageBase64) {
            return res.status(400).json({ message: 'No preview image provided' });
        }

        let previewBuffer;
        if (previewImageBase64.startsWith('data:image/')) {
            const base64Data = previewImageBase64.replace(/^data:image\/\w+;base64,/, '');
            previewBuffer = Buffer.from(base64Data, 'base64');
        } else {
            previewBuffer = Buffer.from(previewImageBase64, 'base64');
        }

        const result = await uploadImageToCloudinary(previewBuffer, 'astronaut-store/designs/previews');

        res.status(200).json({
            previewUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Preview upload error:', error);
        res.status(500).json({ message: 'Failed to upload preview' });
    }
};

module.exports = {
    createDesign,
    getDesignById,
    uploadDesignAsset
};
