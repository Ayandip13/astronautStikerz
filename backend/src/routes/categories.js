const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const { createCategoryValidation, updateCategoryValidation } = require('../validations/categoryValidation');

router.route('/')
    .get(getCategories)
    .post(protect, admin, createCategoryValidation, createCategory);

router.route('/:id')
    .put(protect, admin, updateCategoryValidation, updateCategory)
    .delete(protect, admin, deleteCategory);

router.get('/slug/:slug', getCategoryBySlug);

module.exports = router;
