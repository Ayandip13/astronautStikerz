const express = require('express');
const router = express.Router();
const {
    createDesignRequest,
    getDesignRequests,
    updateDesignRequestStatus
} = require('../controllers/designRequestController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to submit a request
// We use a custom auth middleware that doesn't reject if token is missing
// to allow both guests and logged-in users to submit
const optionalAuth = (req, res, next) => {
    // If token exists, parse it, otherwise just move on
    const token = req.cookies.token;
    if (token) {
        return protect(req, res, next);
    }
    next();
};

router.route('/')
    .post(optionalAuth, createDesignRequest)
    .get(protect, admin, getDesignRequests);

router.route('/:id/status')
    .put(protect, admin, updateDesignRequestStatus);

module.exports = router;
