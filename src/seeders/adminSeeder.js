const { User } = require('../models');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ where: { role: 'admin' } });
        if (!adminExists) {
            console.log('Seeding admin user...');
            await User.create({
                name: 'Admin',
                email: 'admin@example.com',
                password: 'admin', // Will be hashed by hook
                role: 'admin'
            });
            console.log('Admin user seeded successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
