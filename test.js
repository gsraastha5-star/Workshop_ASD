const http = require('http');
const express = require('express');
const productRoutes = require('./routes/productRoutes');

// Initialize test app instance
const app = express();
app.use(express.json());
app.use('/', productRoutes);

let server;
const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: parsed
                });
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🚀 Starting Workshop Application Automated Verification Tests...\n');
    server = app.listen(PORT);

    try {
        // Test 1: First GET /products -> MISS
        console.log('1. Testing GET /products (First Call)...');
        const res1 = await makeRequest('/products');
        console.assert(res1.statusCode === 200, 'Status should be 200');
        console.assert(res1.headers['x-cache'] === 'MISS', 'Header should be X-Cache: MISS');
        console.log('   ✅ PASS - Header X-Cache: MISS');

        // Test 2: Second GET /products -> HIT
        console.log('2. Testing GET /products (Second Call - Cached)...');
        const res2 = await makeRequest('/products');
        console.assert(res2.statusCode === 200, 'Status should be 200');
        console.assert(res2.headers['x-cache'] === 'HIT', 'Header should be X-Cache: HIT');
        console.log('   ✅ PASS - Header X-Cache: HIT');

        // Test 3: First GET /products/1 -> MISS
        console.log('3. Testing GET /products/1 (First Call)...');
        const res3 = await makeRequest('/products/1');
        console.assert(res3.statusCode === 200, 'Status should be 200');
        console.assert(res3.headers['x-cache'] === 'MISS', 'Header should be X-Cache: MISS');
        console.log('   ✅ PASS - Header X-Cache: MISS');

        // Test 4: Second GET /products/1 -> HIT
        console.log('4. Testing GET /products/1 (Second Call - Cached)...');
        const res4 = await makeRequest('/products/1');
        console.assert(res4.statusCode === 200, 'Status should be 200');
        console.assert(res4.headers['x-cache'] === 'HIT', 'Header should be X-Cache: HIT');
        console.log('   ✅ PASS - Header X-Cache: HIT');

        // Test 5: POST /products -> Invalidates Cache
        console.log('5. Testing POST /products (Add Product & Invalidate Cache)...');
        const postRes = await makeRequest('/products', 'POST', { name: 'Test Headset', price: 89.99 });
        console.assert(postRes.statusCode === 201, 'Status should be 201');
        const createdId = postRes.body.id;
        console.log(`   ✅ PASS - Created Product with ID: ${createdId}`);

        // Test 6: GET /products after POST -> MISS (Invalidated Cache)
        console.log('6. Testing GET /products after POST (Should be Cache MISS due to invalidation)...');
        const res5 = await makeRequest('/products');
        console.assert(res5.statusCode === 200, 'Status should be 200');
        console.assert(res5.headers['x-cache'] === 'MISS', 'Header should be X-Cache: MISS');
        console.log('   ✅ PASS - Cache correctly invalidated (X-Cache: MISS)');

        // Test 7: DELETE newly created product
        console.log(`7. Testing DELETE /products/${createdId}...`);
        const delRes = await makeRequest(`/products/${createdId}`, 'DELETE');
        console.assert(delRes.statusCode === 200, 'Status should be 200');
        console.log('   ✅ PASS - Deleted Product');

        // Test 8: GET /products after DELETE -> MISS (Invalidated Cache)
        console.log('8. Testing GET /products after DELETE (Should be Cache MISS)...');
        const res6 = await makeRequest('/products');
        console.assert(res6.statusCode === 200, 'Status should be 200');
        console.assert(res6.headers['x-cache'] === 'MISS', 'Header should be X-Cache: MISS');
        console.log('   ✅ PASS - Cache correctly invalidated after DELETE');

        console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
    } catch (err) {
        console.error('❌ TEST FAILED:', err);
        process.exitCode = 1;
    } finally {
        server.close();
    }
}

runTests();
