const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
    createDesign,
    getDesignById,
    uploadDesignAsset
} = require('../controllers/designController');

// All design routes require authentication as per current plan
router.post('/', protect, createDesign);
router.get('/:id', protect, getDesignById);

// We reuse the existing multer uploadMiddleware for parsing the multipart/form-data
router.post('/upload', protect, upload.single('image'), uploadDesignAsset);

module.exports = router;
