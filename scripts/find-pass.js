const mysql = require('mysql2/promise');

const passwords = ['', 'root', 'password', 'admin', '123456', '12345678', '1234'];

async function findPassword() {
    console.log('Testing passwords for root user...');

    for (const pass of passwords) {
        try {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: pass
            });
            console.log(`\n🎉 FOUND IT! The correct password is: "${pass}"`);
            await connection.end();
            return;
        } catch (err) {
            if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                // continue
            } else {
                console.log(`Error with "${pass}": ${err.code}`);
            }
        }
    }
    console.log('\n❌ Could not find password. You might need to reset your root password.');
}

findPassword();
