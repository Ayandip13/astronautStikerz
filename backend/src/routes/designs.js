const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const {
    createDesign,
    getDesignById,
    uploadDesignAsset
} = require('../controllers/designController');

// Create a design from an uploaded image
router.post('/', optionalAuth, upload.single('image'), createDesign);
router.get('/:id', optionalAuth, getDesignById);

// Upload a preview image (base64 in JSON)
router.post('/preview', uploadDesignAsset);

module.exports = router;
