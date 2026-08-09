const Category = require('../models/Category');

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find(
            req.user && req.user.role === 'admin' ? {} : { active: true }
        ).sort({ displayOrder: 1, createdAt: -1 });
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

const getCategoryBySlug = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (category) {
            if (!category.active && (!req.user || req.user.role !== 'admin')) {
                res.status(404);
                throw new Error('Category not found');
            }
            res.json(category);
        } else {
            res.status(404);
            throw new Error('Category not found');
        }
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, slug, description, image, active, displayOrder } = req.body;
        
        const categoryExists = await Category.findOne({ slug });
        if (categoryExists) {
            res.status(400);
            throw new Error('Category with this slug already exists');
        }

        const category = await Category.create({
            name, slug, description, image, active, displayOrder
        });

        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { name, slug, description, image, active, displayOrder } = req.body;
        
        const category = await Category.findById(req.params.id);
        
        if (category) {
            if (slug && slug !== category.slug) {
                const slugExists = await Category.findOne({ slug });
                if (slugExists) {
                    res.status(400);
                    throw new Error('Category with this slug already exists');
                }
            }

            category.name = name || category.name;
            category.slug = slug || category.slug;
            category.description = description !== undefined ? description : category.description;
            category.image = image !== undefined ? image : category.image;
            category.active = active !== undefined ? active : category.active;
            category.displayOrder = displayOrder !== undefined ? displayOrder : category.displayOrder;

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404);
            throw new Error('Category not found');
        }
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            // Usually we might just deactivate or check if products exist. Here we soft delete or hard delete.
            // Let's hard delete for simplicity or deactivate. The instructions say "Delete/deactivate category".
            // Let's just delete it.
            await Category.deleteOne({ _id: category._id });
            res.json({ message: 'Category removed' });
        } else {
            res.status(404);
            throw new Error('Category not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
};
