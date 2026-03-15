const { sequelize, MenuItem, RawMaterial, Recipe } = require('../models');

// Step 1: More Menu Items to add
const newMenuItems = [
    { name: 'Mushroom Risotto', price: 14.99, category: 'Main Course', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500&q=80', isAvailable: true },
    { name: 'Penne Arrabbiata', price: 10.50, category: 'Main Course', image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&q=80', isAvailable: true },
    { name: 'Garlic Bread', price: 4.50, category: 'Starters', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80', isAvailable: true },
    { name: 'Tiramisu', price: 8.00, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80', isAvailable: true },
    { name: 'Fresh Orange Juice', price: 4.00, category: 'Beverages', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80', isAvailable: true }
];

// Map of Recipe names to the exact required ingredients and their quantities
const prepRecipes = {
    'Classic Cheeseburger': [
        { material: 'Beef Mince', qty: 0.15 }, // 150g
        { material: 'Cheese (Cheddar)', qty: 0.05 }, // 50g
        { material: 'Lettuce', qty: 0.1 }, // 1/10th head
        { material: 'Tomatoes', qty: 0.05 }, // 50g
    ],
    'Margherita Pizza': [
        { material: 'Flour', qty: 0.2 }, // 200g
        { material: 'Cheese (Mozzarella)', qty: 0.15 }, // 150g
        { material: 'Tomatoes', qty: 0.2 }, // 200g
        { material: 'Olive Oil', qty: 0.02 } // 20ml
    ],
    'Spaghetti Carbonara': [
        { material: 'Pasta (Spaghetti)', qty: 0.15 }, // 150g
        { material: 'Eggs', qty: 2 }, // 2 pcs
        { material: 'Cheese (Cheddar)', qty: 0.05 } // 50g sub for pecorino for now
    ],
    'Mushroom Risotto': [
        { material: 'Rice (Basmati)', qty: 0.15 }, // 150g
        { material: 'Butter', qty: 0.03 }, // 30g
        { material: 'Cheese (Cheddar)', qty: 0.02 }, // 20g 
        { material: 'Vegetable Oil', qty: 0.01 } // 10ml
    ],
    'Tiramisu': [
        { material: 'Eggs', qty: 1 }, // 1 pc
        { material: 'Sugar', qty: 0.05 }, // 50g
        { material: 'Cheese (Mozzarella)', qty: 0.05 } // 50g sub mascarpone
    ]
};


const seedRecipes = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Add new menu items if they don't exist
        for (const item of newMenuItems) {
            const existing = await MenuItem.findOne({ where: { name: item.name } });
            if (!existing) {
                await MenuItem.create(item);
                console.log(`Added menu item: ${item.name}`);
            }
        }

        // 2. Map existing recipes
        // First get all items
        const allItems = await MenuItem.findAll();
        const allMaterials = await RawMaterial.findAll();

        const materialMap = {};
        allMaterials.forEach(m => materialMap[m.name] = m.id);

        for (const dishName of Object.keys(prepRecipes)) {
            const recipeDetails = prepRecipes[dishName];
            const dish = allItems.find(i => i.name === dishName);

            if (!dish) {
                console.log(`Dish ${dishName} not found, skipping.`);
                continue;
            }

            for (const ing of recipeDetails) {
                const matId = materialMap[ing.material];
                if (!matId) {
                    console.log(`Material ${ing.material} not found, skipping for recipe ${dishName}.`);
                    continue;
                }

                // Check if already connected
                const existingLink = await Recipe.findOne({
                    where: { menu_item_id: dish.id, raw_material_id: matId }
                });

                if (!existingLink) {
                    await Recipe.create({
                        menu_item_id: dish.id,
                        raw_material_id: matId,
                        qty_required: ing.qty
                    });
                    console.log(`Linked ${ing.qty} of ${ing.material} to ${dishName}.`);
                }
            }
        }

        console.log('Successfully seeded additional menu items and linked recipes!');
        process.exit();

    } catch (err) {
        console.error('Error seeding recipes:', err);
        process.exit(1);
    }
};

seedRecipes();
