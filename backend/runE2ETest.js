const axios = require('axios');
const fs = require('fs');
const path = require('path');

const LIVE_API_URL = 'https://astronautstikerz.onrender.com/api';
const STOREFRONT_URL = 'https://astronaut-stikerz.vercel.app';

async function runTest() {
    try {
        console.log('1. Authenticating as Admin against the live production API...');
        const loginRes = await axios.post(`${LIVE_API_URL}/auth/login`, {
            email: 'admin@astronautstickerz.com',
            password: 'admin123'
        });
        
        console.log('Login Success!');
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        console.log('\n2. Testing Cloudinary upload on live backend...');
        
        // Read a test image
        const imgPath = path.join(__dirname, 'uploads/1786436890346-857011055.jpg');
        let fileBuffer;
        try {
            fileBuffer = fs.readFileSync(imgPath);
        } catch (err) {
            // Fallback to a small base64 pixel
            fileBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        }

        const formData = new FormData();
        const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'test.jpg');

        let uploadRes;
        try {
            uploadRes = await axios.post(`${LIVE_API_URL}/upload`, formData, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Upload Succeeded on Live Backend!');
            console.log('Upload Response:', uploadRes.data);
        } catch (uploadErr) {
            console.error('Upload Failed on Live Backend!');
            if (uploadErr.response) {
                console.error('Status Code:', uploadErr.response.status);
                console.error('Response Data:', JSON.stringify(uploadErr.response.data, null, 2));
            } else {
                console.error('Error Message:', uploadErr.message);
            }
            process.exit(1);
        }

        const uploadedUrl = uploadRes.data.url;
        const uploadedPublicId = uploadRes.data.public_id || uploadRes.data.publicId;

        console.log('\nChecking Code Version / Credentials of Live Backend based on upload result:');
        if (uploadedUrl.startsWith('/uploads')) {
            console.log('⚠️ ALERT: The live backend is STILL running the OLD local upload code!');
            console.log('The database continues to receive ephemeral relative paths.');
        } else if (uploadedUrl.includes('res.cloudinary.com')) {
            console.log('✅ PASS: The live backend is running the new Cloudinary code and has write-enabled credentials!');
        } else {
            console.log('Unknown URL format returned:', uploadedUrl);
        }

        // 3. Create a test product
        console.log('\n3. Creating a test product via live API...');
        const uniqueSuffix = Date.now();
        const testProductData = {
            name: `E2E Verification Product ${uniqueSuffix}`,
            slug: `e2e-verif-prod-${uniqueSuffix}`,
            description: 'A temporary product created to verify Cloudinary persistence after backend redeploys.',
            price: 99,
            category: '6a7a4007f4f885d438d53a4f', // category ID for Mousepad (must exist)
            images: [{
                url: uploadedUrl,
                publicId: uploadedPublicId || '',
                alt: 'E2E test image'
            }],
            stock: 10,
            active: true,
            featured: true
        };

        const createRes = await axios.post(`${LIVE_API_URL}/products`, testProductData, { headers });
        console.log('Product Created Successfully on Live Backend!');
        console.log('Created Product ID:', createRes.data._id);
        console.log('Stored Images Field:', JSON.stringify(createRes.data.images, null, 2));

        // 4. Query public product API
        console.log('\n4. Querying Public Products API...');
        const publicListRes = await axios.get(`${LIVE_API_URL}/products`);
        const foundInList = publicListRes.data.products.find(p => p._id === createRes.data._id);
        if (foundInList) {
            console.log('✅ PASS: Product appears in public listings!');
            console.log('Image URL in public listing:', foundInList.images[0]?.url);
        } else {
            console.error('❌ FAIL: Product not found in public listings.');
        }

        // 5. Run health check
        console.log('\n5. Running Products Health Check...');
        const healthRes = await axios.get(`${LIVE_API_URL}/admin/products-health`, { headers });
        console.log('Health check completed successfully!');
        console.log('Unhealthy Count:', healthRes.data.unhealthyCount);
        console.log('Checked Count:', healthRes.data.checkedCount);
        
        const testProdReport = healthRes.data.report.find(r => r.productId === createRes.data._id);
        if (testProdReport) {
            console.log('New Test Product Health Report:', JSON.stringify(testProdReport, null, 2));
        } else {
            console.warn('Could not find new product in health report.');
        }

        // Clean up the created test product so we don't clutter the catalog
        console.log('\n6. Cleaning up test product from live database...');
        const deleteRes = await axios.delete(`${LIVE_API_URL}/products/${createRes.data._id}`, { headers });
        console.log('Product deleted:', deleteRes.data.message);
        
        console.log('\nE2E verification check finished.');
    } catch (err) {
        console.error('Error during E2E verification test:', err.response?.data || err.message);
    }
}

runTest();
