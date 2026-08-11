require('dotenv').config();
const { uploadImageToCloudinary } = require('./src/services/uploadService');
const fs = require('fs');

async function testUpload() {
    try {
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        const result = await uploadImageToCloudinary(buffer, '');
        console.log('Upload success:', result.secure_url);
    } catch (e) {
        console.error('Upload failed:', e);
    }
}

testUpload();
