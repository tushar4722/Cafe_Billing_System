const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    console.log('--- DIAGNOSTIC START ---');
    console.log(`Trying to connect to ${process.env.DB_HOST} as ${process.env.DB_USER}`);
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });
        console.log('SUCCESS: Connected!');
        await conn.end();
    } catch (err) {
        console.log('ERROR: Connection Failed');
        console.log('Code:', err.code);
        console.log('Message:', err.message);
        console.log('Errno:', err.errno);
    }
    console.log('--- DIAGNOSTIC END ---');
}

check();
