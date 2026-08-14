require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const Design = require('./src/models/Design');
const Order = require('./src/models/Order');

const LOCALHOST_PREFIX = 'http://localhost:5000';

async function migrate() {
    try {
        console.log("Connecting to MongoDB database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB!");

        // 1. Migrate Products
        console.log("\n--- Migrating Products ---");
        const products = await Product.find({});
        let updatedProductsCount = 0;
        for (const product of products) {
            let modified = false;
            if (product.images && product.images.length > 0) {
                const newImages = product.images.map(img => {
                    if (typeof img === 'string' && img.startsWith(LOCALHOST_PREFIX)) {
                        modified = true;
                        return img.substring(LOCALHOST_PREFIX.length);
                    }
                    return img;
                });
                if (modified) {
                    product.images = newImages;
                    await product.save();
                    console.log(`Updated images for product: ${product.name} (${product.slug})`);
                    updatedProductsCount++;
                }
            }
        }
        console.log(`Successfully migrated ${updatedProductsCount} products.`);

        // 2. Migrate Categories
        console.log("\n--- Migrating Categories ---");
        const categories = await Category.find({});
        let updatedCategoriesCount = 0;
        for (const category of categories) {
            if (category.image && category.image.startsWith(LOCALHOST_PREFIX)) {
                category.image = category.image.substring(LOCALHOST_PREFIX.length);
                await category.save();
                console.log(`Updated image for category: ${category.name}`);
                updatedCategoriesCount++;
            }
        }
        console.log(`Successfully migrated ${updatedCategoriesCount} categories.`);

        // 3. Migrate Designs
        console.log("\n--- Migrating Designs ---");
        const designs = await Design.find({});
        let updatedDesignsCount = 0;
        for (const design of designs) {
            if (design.imageUrl && design.imageUrl.startsWith(LOCALHOST_PREFIX)) {
                design.imageUrl = design.imageUrl.substring(LOCALHOST_PREFIX.length);
                await design.save();
                console.log(`Updated imageUrl for design: ${design.name}`);
                updatedDesignsCount++;
            }
        }
        console.log(`Successfully migrated ${updatedDesignsCount} designs.`);

        // 4. Migrate Orders
        console.log("\n--- Migrating Orders ---");
        const orders = await Order.find({});
        let updatedOrdersCount = 0;
        for (const order of orders) {
            let modified = false;
            if (order.items && order.items.length > 0) {
                for (const item of order.items) {
                    if (item.image && item.image.startsWith(LOCALHOST_PREFIX)) {
                        item.image = item.image.substring(LOCALHOST_PREFIX.length);
                        modified = true;
                    }
                    if (item.previewImage && item.previewImage.startsWith(LOCALHOST_PREFIX)) {
                        item.previewImage = item.previewImage.substring(LOCALHOST_PREFIX.length);
                        modified = true;
                    }
                }
            }
            if (modified) {
                await order.save();
                console.log(`Updated images for order: ${order._id}`);
                updatedOrdersCount++;
            }
        }
        console.log(`Successfully migrated ${updatedOrdersCount} orders.`);

        console.log("\nMigration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed with error:", error);
        process.exit(1);
    }
}

migrate();
