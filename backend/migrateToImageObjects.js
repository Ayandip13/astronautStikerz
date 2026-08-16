require('dotenv').config();
const mongoose = require('mongoose');

const extractPublicIdFromUrl = (url) => {
    if (!url || !url.includes('res.cloudinary.com')) return '';
    try {
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) return '';
        
        const pathAfterUpload = url.substring(uploadIndex + 8);
        const parts = pathAfterUpload.split('/');
        
        // Remove version number (e.g. v12345678) if present
        if (parts[0].startsWith('v') && !isNaN(parts[0].substring(1))) {
            parts.shift();
        }
        
        const publicIdWithExt = parts.join('/');
        const lastDotIndex = publicIdWithExt.lastIndexOf('.');
        if (lastDotIndex === -1) return publicIdWithExt;
        return publicIdWithExt.substring(0, lastDotIndex);
    } catch (err) {
        console.error('Error extracting publicId from URL:', url, err);
        return '';
    }
};

async function migrate() {
    try {
        console.log('Connecting to database...');
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not set in environment!');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const db = mongoose.connection.db;
        const productsCollection = db.collection('products');
        
        const products = await productsCollection.find({}).toArray();
        console.log(`Found ${products.length} products to check.`);
        
        let migratedCount = 0;
        
        for (const p of products) {
            let modified = false;
            
            if (p.images && Array.isArray(p.images)) {
                const newImages = p.images.map(img => {
                    if (typeof img === 'string') {
                        modified = true;
                        return {
                            url: img,
                            publicId: extractPublicIdFromUrl(img),
                            alt: p.name || ''
                        };
                    }
                    // If it is already an object but missing publicId (for Cloudinary URLs)
                    if (img && typeof img === 'object' && img.url && !img.publicId && img.url.includes('res.cloudinary.com')) {
                        modified = true;
                        return {
                            url: img.url,
                            publicId: extractPublicIdFromUrl(img.url),
                            alt: img.alt || p.name || ''
                        };
                    }
                    return img;
                });
                
                if (modified) {
                    await productsCollection.updateOne(
                        { _id: p._id },
                        { $set: { images: newImages } }
                    );
                    console.log(`Migrated product images for: "${p.name}"`);
                    migratedCount++;
                }
            }
        }
        
        console.log(`Migration complete. Updated ${migratedCount} products.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
