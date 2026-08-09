const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let cookieHeader = '';
let adminCookieHeader = '';

async function runTests() {
    try {
        console.log('1. Setup Admin');
        const setupRes = await axios.post(`${API_URL}/auth/setup-admin`, {
            secret: 'my_super_secret_setup_key',
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123'
        });
        console.log('Admin Setup:', setupRes.status === 201 ? 'PASS' : 'FAIL');
    } catch (e) {
        if (e.response?.data?.message === 'Admin user already exists with this email') {
             console.log('Admin Setup: Already exists');
        } else {
             console.error('Admin Setup Failed:', e.response?.data || e.message);
        }
    }

    try {
        console.log('2. Customer Registration');
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Customer',
            email: `customer${Date.now()}@example.com`,
            password: 'password123'
        });
        cookieHeader = regRes.headers['set-cookie'][0].split(';')[0];
        console.log('Customer Registration:', regRes.status === 201 ? 'PASS' : 'FAIL');

        console.log('3. Current-user endpoint (Customer)');
        const meRes = await axios.get(`${API_URL}/auth/me`, { headers: { Cookie: cookieHeader } });
        console.log('Current User (Customer):', meRes.data.role === 'customer' ? 'PASS' : 'FAIL');

        console.log('4. Customer attempting admin API (Create Category)');
        try {
            await axios.post(`${API_URL}/categories`, { name: 'Test', slug: 'test' }, { headers: { Cookie: cookieHeader } });
            console.log('Customer accessing Admin API: FAIL (Should have been rejected)');
        } catch (e) {
            console.log('Customer accessing Admin API:', e.response?.status === 403 ? 'PASS' : 'FAIL');
        }

        console.log('5. Unauthenticated user attempting admin API');
        try {
            await axios.post(`${API_URL}/categories`, { name: 'Test', slug: 'test' });
            console.log('Unauth accessing Admin API: FAIL (Should have been rejected)');
        } catch (e) {
            console.log('Unauth accessing Admin API:', e.response?.status === 401 ? 'PASS' : 'FAIL');
        }

        console.log('6. Customer Logout');
        const logoutRes = await axios.post(`${API_URL}/auth/logout`, {}, { headers: { Cookie: cookieHeader } });
        console.log('Customer Logout:', logoutRes.status === 200 ? 'PASS' : 'FAIL');
        cookieHeader = '';

        console.log('7. Admin Login');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'password123'
        });
        adminCookieHeader = loginRes.headers['set-cookie'][0].split(';')[0];
        console.log('Admin Login:', loginRes.status === 200 && loginRes.data.role === 'admin' ? 'PASS' : 'FAIL');

        console.log('8. Admin creating a category');
        const catSlug = `cat-${Date.now()}`;
        const catRes = await axios.post(`${API_URL}/categories`, {
            name: 'New Category',
            slug: catSlug,
            description: 'Test Category'
        }, { headers: { Cookie: adminCookieHeader } });
        console.log('Create Category:', catRes.status === 201 ? 'PASS' : 'FAIL');
        const categoryId = catRes.data._id;

        console.log('9. Admin creating a product');
        const prodSlug = `prod-${Date.now()}`;
        const prodRes = await axios.post(`${API_URL}/products`, {
            name: 'New Product',
            slug: prodSlug,
            description: 'Test Product',
            price: 19.99,
            category: categoryId,
            stock: 10
        }, { headers: { Cookie: adminCookieHeader } });
        console.log('Create Product:', prodRes.status === 201 ? 'PASS' : 'FAIL');
        const productId = prodRes.data._id;

        console.log('10. Admin updating a product');
        const updateRes = await axios.put(`${API_URL}/products/${productId}`, {
            price: 24.99
        }, { headers: { Cookie: adminCookieHeader } });
        console.log('Update Product:', updateRes.data.price === 24.99 ? 'PASS' : 'FAIL');

        console.log('11. Public product listing');
        const listRes = await axios.get(`${API_URL}/products`);
        console.log('Public List:', listRes.data.products.length > 0 ? 'PASS' : 'FAIL');

        console.log('12. Public product detail by slug');
        const detailRes = await axios.get(`${API_URL}/products/slug/${prodSlug}`);
        console.log('Product Detail:', detailRes.data.name === 'New Product' ? 'PASS' : 'FAIL');

        console.log('13. Product search/filter/sort/pagination');
        const searchRes = await axios.get(`${API_URL}/products?keyword=New&sort=price_desc`);
        console.log('Product Search:', searchRes.data.products.length > 0 ? 'PASS' : 'FAIL');

        console.log('All API end-to-end tests completed.');

    } catch (e) {
        console.error('Test Failed Exception:', e.response?.data || e.message);
    }
}

runTests();
