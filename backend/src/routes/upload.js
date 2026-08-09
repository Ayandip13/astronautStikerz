const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImageToCloudinary } = require('../services/uploadService');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('No image file provided');
        }

        const result = await uploadImageToCloudinary(req.file.buffer, 'astronaut-store/products');
        
        res.status(200).json({
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
