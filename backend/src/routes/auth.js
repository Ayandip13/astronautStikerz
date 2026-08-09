const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    setupAdmin
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const { registerValidation, loginValidation, setupAdminValidation } = require('../validations/authValidation');

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getUserProfile);
router.post('/setup-admin', setupAdminValidation, setupAdmin);

module.exports = router;
