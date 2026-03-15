const { sequelize, MenuItem } = require('../models');

const menuItems = [
    {
        name: 'Classic Cheeseburger',
        price: 8.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
        isAvailable: true
    },
    {
        name: 'Margherita Pizza',
        price: 12.50,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80',
        isAvailable: true
    },
    {
        name: 'Caesar Salad',
        price: 7.50,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&q=80',
        isAvailable: true
    },
    {
        name: 'Spaghetti Carbonara',
        price: 11.00,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80',
        isAvailable: true
    },
    {
        name: 'Grilled Salmon',
        price: 18.00,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=500&q=80',
        isAvailable: true
    },
    {
        name: 'Chocolate Lava Cake',
        price: 6.99,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=500&q=80',
        isAvailable: true
    },
    {
        name: 'Iced Latte',
        price: 4.50,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c5090c?w=500&q=80',
        isAvailable: true
    },
    {
        name: 'Mojito (Non-Alcoholic)',
        price: 5.00,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80',
        isAvailable: true
    },
    {
        name: 'Chicken Wings (6pcs)',
        price: 9.99,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&q=80',
        isAvailable: true
    },
    {
        name: 'Vegetable Stir Fry',
        price: 10.50,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=500&q=80',
        isAvailable: false
    }
];

const seedMenu = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync models to ensure new columns (isAvailable) exist
        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        // await MenuItem.destroy({ where: {}, truncate: true }); // Optional: uncomment if you want to clear existing items


        for (const item of menuItems) {
            await MenuItem.create(item);
        }

        console.log('Menu items seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding menu:', error);
        process.exit(1);
    }
};

seedMenu();
