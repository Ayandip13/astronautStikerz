require('dotenv').config();
const cloudinary = require('./src/config/cloudinary');

async function testErrorProperties() {
    try {
        console.log('Testing Cloudinary direct upload...');
        await cloudinary.uploader.upload(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            { folder: 'test' }
        );
    } catch (e) {
        console.log('Error Keys:', Object.keys(e));
        console.log('Error Message:', e.message);
        console.log('Error HTTP Code:', e.http_code);
        console.log('Error Name:', e.name);
        if (e.request_options) {
            console.log('Request Options:', e.request_options);
        }
        // Let's print the entire error object with all details
        console.log('JSON stringified error:', JSON.stringify(e, null, 2));
    }
}

testErrorProperties();
