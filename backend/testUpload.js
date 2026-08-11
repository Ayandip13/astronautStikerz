require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('./src/config/cloudinary');

async function test() {
    try {
        console.log('Testing Cloudinary upload...');
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'test' },
            (error, result) => {
                if (error) {
                    console.error('CLOUDINARY ERROR:', error);
                } else {
                    console.log('SUCCESS:', result.secure_url);
                }
            }
        );
        uploadStream.end(buffer);
    } catch (e) {
        console.error('CATCH:', e);
    }
}

test();
