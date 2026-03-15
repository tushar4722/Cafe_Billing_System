const mysql = require('mysql2/promise');

const passwords = ['', 'root', 'password', 'admin', '123456', '12345678', '1234'];

async function testConnection() {
    console.log('Testing MySQL connections...');

    for (const pass of passwords) {
        try {
            console.log(`Trying password: "${pass}"...`);
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: pass
            });
            console.log(`\n🎉 SUCCESS! Connected with password: "${pass}"`);
            await connection.end();
            return;
        } catch (err) {
            if (err.code === 'ECONNREFUSED') {
                console.log('❌ Connection Refused. Is MySQL running?');
                return; // No point trying other passwords if server is down
            }
            // console.log(`Failed with "${pass}": ${err.message}`);
        }
    }
    console.log('\n❌ Failed to connect with common passwords.');
}

testConnection();
