const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
    try {
        const pageSize = Number(req.query.limit) || 12;
        const page = Number(req.query.page) || 1;

        let query = {};
        
        if (!req.user || req.user.role !== 'admin') {
            query.active = true;
        } else if (req.query.active !== undefined) {
            query.active = req.query.active === 'true';
        }

        if (req.query.keyword) {
            query.name = {
                $regex: req.query.keyword,
                $options: 'i',
            };
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.featured !== undefined) {
            query.featured = req.query.featured === 'true';
        }

        let sortOption = { createdAt: -1 };
        if (req.query.sort) {
            if (req.query.sort === 'price_asc') sortOption = { price: 1 };
            if (req.query.sort === 'price_desc') sortOption = { price: -1 };
            if (req.query.sort === 'newest') sortOption = { createdAt: -1 };
        }

        const count = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        next(error);
    }
};

const getProductBySlug = async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
        
        if (product) {
            if (!product.active && (!req.user || req.user.role !== 'admin')) {
                res.status(404);
                throw new Error('Product not found');
            }
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const {
            name, slug, description, price, compareAtPrice, sku,
            category, images, stock, active, featured,
            customizable, customizationConfig
        } = req.body;

        const slugExists = await Product.findOne({ slug });
        if (slugExists) {
            res.status(400);
            throw new Error('Product with this slug already exists');
        }

        if (sku) {
            const skuExists = await Product.findOne({ sku });
            if (skuExists) {
                res.status(400);
                throw new Error('Product with this SKU already exists');
            }
        }

        const product = await Product.create({
            name, slug, description, price, compareAtPrice, sku,
            category, images, stock, active, featured,
            customizable, customizationConfig
        });

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const {
            name, slug, description, price, compareAtPrice, sku,
            category, images, stock, active, featured,
            customizable, customizationConfig
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            if (slug && slug !== product.slug) {
                const slugExists = await Product.findOne({ slug });
                if (slugExists) {
                    res.status(400);
                    throw new Error('Product with this slug already exists');
                }
            }

            if (sku && sku !== product.sku) {
                const skuExists = await Product.findOne({ sku });
                if (skuExists) {
                    res.status(400);
                    throw new Error('Product with this SKU already exists');
                }
            }

            product.name = name || product.name;
            product.slug = slug || product.slug;
            product.description = description || product.description;
            product.price = price !== undefined ? price : product.price;
            product.compareAtPrice = compareAtPrice !== undefined ? compareAtPrice : product.compareAtPrice;
            product.sku = sku !== undefined ? sku : product.sku;
            product.category = category || product.category;
            product.images = images || product.images;
            product.stock = stock !== undefined ? stock : product.stock;
            product.active = active !== undefined ? active : product.active;
            product.featured = featured !== undefined ? featured : product.featured;
            product.customizable = customizable !== undefined ? customizable : product.customizable;
            product.customizationConfig = customizationConfig || product.customizationConfig;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct
};
