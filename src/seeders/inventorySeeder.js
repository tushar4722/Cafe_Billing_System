const { sequelize, RawMaterial } = require('../models');

const inventoryItems = [
    { name: 'Flour', unit: 'kg', current_stock: 50, minimum_stock: 10 },
    { name: 'Sugar', unit: 'kg', current_stock: 20, minimum_stock: 5 },
    { name: 'Salt', unit: 'kg', current_stock: 5, minimum_stock: 2 },
    { name: 'Tomatoes', unit: 'kg', current_stock: 15, minimum_stock: 5 },
    { name: 'Onions', unit: 'kg', current_stock: 25, minimum_stock: 10 },
    { name: 'Potatoes', unit: 'kg', current_stock: 30, minimum_stock: 15 },
    { name: 'Chicken Breast', unit: 'kg', current_stock: 40, minimum_stock: 20 },
    { name: 'Beef Mince', unit: 'kg', current_stock: 15, minimum_stock: 10 },
    { name: 'Salmon Fillet', unit: 'kg', current_stock: 8, minimum_stock: 5 },
    { name: 'Eggs', unit: 'pcs', current_stock: 200, minimum_stock: 50 },
    { name: 'Milk', unit: 'liters', current_stock: 25, minimum_stock: 10 },
    { name: 'Butter', unit: 'kg', current_stock: 12, minimum_stock: 5 },
    { name: 'Cheese (Cheddar)', unit: 'kg', current_stock: 10, minimum_stock: 4 },
    { name: 'Cheese (Mozzarella)', unit: 'kg', current_stock: 15, minimum_stock: 5 },
    { name: 'Olive Oil', unit: 'liters', current_stock: 10, minimum_stock: 3 },
    { name: 'Vegetable Oil', unit: 'liters', current_stock: 20, minimum_stock: 5 },
    { name: 'Pasta (Spaghetti)', unit: 'kg', current_stock: 18, minimum_stock: 8 },
    { name: 'Pasta (Penne)', unit: 'kg', current_stock: 15, minimum_stock: 5 },
    { name: 'Rice (Basmati)', unit: 'kg', current_stock: 45, minimum_stock: 20 },
    { name: 'Garlic', unit: 'kg', current_stock: 3, minimum_stock: 1 },
    { name: 'Ginger', unit: 'kg', current_stock: 2, minimum_stock: 1 },
    { name: 'Lettuce', unit: 'heads', current_stock: 20, minimum_stock: 10 },
    { name: 'Spinach', unit: 'kg', current_stock: 5, minimum_stock: 2 },
    { name: 'Carrots', unit: 'kg', current_stock: 12, minimum_stock: 5 },
    { name: 'Bell Peppers', unit: 'kg', current_stock: 8, minimum_stock: 3 }
];

const seedInventory = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        // Clear existing inventory (optional, maybe not want to clear if the user already added some, but for "add some inventory", this is clean)
        // await RawMaterial.destroy({ where: {}, truncate: true });

        for (const item of inventoryItems) {
            // Check if it exists to avoid duplicates if run multiple times
            const existing = await RawMaterial.findOne({ where: { name: item.name } });
            if (!existing) {
                await RawMaterial.create(item);
            }
        }

        console.log('Inventory items seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding inventory:', error);
        process.exit(1);
    }
};

seedInventory();
