const http = require('http');

async function testAdminLogin() {
    try {
        console.log('🔍 Testing Admin Login API...\n');

        const postData = JSON.stringify({
            email: 'admin@vidyank.com',
            password: 'Admin@123'
        });

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/users/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log('✅ API Response Status:', res.statusCode);

                if (res.statusCode === 200) {
                    const response = JSON.parse(data);
                    console.log('✅ Response Data:', JSON.stringify(response, null, 2));

                    // Verify critical fields
                    const checks = {
                        'Has _id': !!response._id,
                        'Has email': !!response.email,
                        'Has token': !!response.token,
                        'isAdmin is true': response.isAdmin === true,
                        'Has firstName': !!response.firstName,
                        'Has lastName': !!response.lastName
                    };

                    console.log('\n📋 Field Verification:');
                    Object.entries(checks).forEach(([key, value]) => {
                        console.log(`   ${value ? '✅' : '❌'} ${key}`);
                    });

                    const allPassed = Object.values(checks).every(v => v === true);

                    if (allPassed) {
                        console.log('\n🎉 STEP 1 VERIFICATION: PASSED');
                        console.log('   Admin login API is working correctly!');
                    } else {
                        console.log('\n❌ STEP 1 VERIFICATION: FAILED');
                        console.log('   Some fields are missing or incorrect!');
                    }
                } else {
                    console.log('❌ Response:', data);
                    console.log('\n❌ STEP 1 VERIFICATION: FAILED');
                    console.log('   Status Code:', res.statusCode);

                    if (res.statusCode === 401) {
                        console.log('\n🔍 Possible Issues:');
                        console.log('   1. Admin user not created in database');
                        console.log('   2. Wrong password');
                        console.log('   3. Password hashing issue');
                        console.log('\n💡 Solution: Run "node seedAdmin.js" in backend folder');
                    }
                }
            });
        });

        req.on('error', (error) => {
            console.log('\n❌ STEP 1 VERIFICATION: FAILED');
            console.log('   Error:', error.message);

            if (error.code === 'ECONNREFUSED') {
                console.log('\n🔍 Possible Issues:');
                console.log('   1. Backend server not running');
                console.log('\n💡 Solution: Run "npm start" in backend folder');
            }
        });

        req.write(postData);
        req.end();

    } catch (error) {
        console.log('\n❌ STEP 1 VERIFICATION: FAILED');
        console.log('   Unexpected Error:', error.message);
    }
}

testAdminLogin();
