const http = require('http');

http.get('http://localhost:5000/uploads/astronaut-store/products/1786437241328-769666259.jpg', (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
