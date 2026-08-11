const http = require('http');

http.get('http://localhost:3000/_next/image?url=http%3A%2F%2Flocalhost%3A5000%2Fuploads%2Fastronaut-store%2Fproducts%2F1786437241328-769666259.jpg&w=1080&q=75', (res) => {
    console.log(`Next.js image proxy Status Code: ${res.statusCode}`);
    res.on('data', d => process.stdout.write(d.toString().substring(0, 50)));
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
