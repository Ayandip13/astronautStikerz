require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');

async function run() {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected! Fetching products...");
        const products = await Product.find({}).lean();
        console.log(`Found ${products.length} products:`);
        products.forEach(p => {
            console.log(`- ID: ${p._id}, Name: ${p.name}, Slug: ${p.slug}, Images:`, p.images);
        });
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}
run();
