const Design = require('../models/Design');
const Product = require('../models/Product');
const { uploadImageToCloudinary } = require('../services/uploadService');

// @desc    Create a new design
// @route   POST /api/designs
// @access  Private
const createDesign = async (req, res) => {
    try {
        const { product: productId, designState, previewImageBase64, assets } = req.body;

        if (!productId || !designState || !previewImageBase64) {
            return res.status(400).json({ message: 'Missing required design fields' });
        }

        // Verify product exists and is customizable
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (!product.active) {
            return res.status(400).json({ message: 'Product is currently inactive' });
        }
        if (!product.customizable) {
            return res.status(400).json({ message: 'Product is not customizable' });
        }

        // Extract base64 buffer from data URI if necessary
        let previewBuffer;
        if (previewImageBase64.startsWith('data:image/')) {
            const base64Data = previewImageBase64.replace(/^data:image\/\w+;base64,/, '');
            previewBuffer = Buffer.from(base64Data, 'base64');
        } else {
            previewBuffer = Buffer.from(previewImageBase64, 'base64');
        }

        // Upload preview to Cloudinary
        const cloudinaryResult = await uploadImageToCloudinary(previewBuffer, 'astronaut-store/designs/previews');

        // Create the design
        const design = new Design({
            user: req.user._id,
            product: productId,
            designState,
            previewImage: cloudinaryResult.secure_url,
            assets: assets || [],
        });

        const createdDesign = await design.save();
        res.status(201).json(createdDesign);
    } catch (error) {
        console.error('Design creation error:', error);
        res.status(500).json({ message: 'Failed to save design' });
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

        // Ensure ownership or admin
        if (design.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to access this design' });
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
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // The multer uploadMiddleware handles basic mimetype validation.
        // We can upload to a specific assets folder in Cloudinary.
        const result = await uploadImageToCloudinary(req.file.buffer, 'astronaut-store/designs/assets');

        res.status(200).json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error('Asset upload error:', error);
        res.status(500).json({ message: 'Failed to upload artwork' });
    }
};

module.exports = {
    createDesign,
    getDesignById,
    uploadDesignAsset
};
