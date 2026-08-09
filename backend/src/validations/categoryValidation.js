const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

const createCategoryValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    validate
];

const updateCategoryValidation = [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('slug').optional().trim().notEmpty().withMessage('Slug cannot be empty'),
    validate
];

module.exports = {
    createCategoryValidation,
    updateCategoryValidation
};
