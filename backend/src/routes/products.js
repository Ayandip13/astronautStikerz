const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { createProductValidation, updateProductValidation } = require('../validations/productValidation');

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProductValidation, createProduct);

router.route('/:id')
    .put(protect, admin, updateProductValidation, updateProduct)
    .delete(protect, admin, deleteProduct);

router.get('/slug/:slug', getProductBySlug);

module.exports = router;
