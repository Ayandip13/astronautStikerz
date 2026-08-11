const express = require('express');
const upload = require('./src/middleware/uploadMiddleware');
const request = require('supertest');
const fs = require('fs');
const path = require('path');

const app = express();
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
    }
    res.json({ message: 'Success', file: req.file.originalname });
});

async function run() {
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    
    // Create a temporary valid image file to test with supertest
    fs.writeFileSync('temp.png', buffer);

    request(app)
        .post('/upload')
        .attach('image', 'temp.png')
        .expect(200)
        .end((err, res) => {
            if (err) console.error('Error:', res.body);
            else console.log('Result:', res.body);
            fs.unlinkSync('temp.png');
        });
}
run();
