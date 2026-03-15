const { Recipe, MenuItem, RawMaterial } = require('../models');

exports.addRecipeIngredient = async (req, res) => {
    try {
        const { menu_item_id, raw_material_id, qty_required } = req.body;

        // Check if ingredient already exists for this item
        const existing = await Recipe.findOne({
            where: { menu_item_id, raw_material_id }
        });

        if (existing) {
            existing.qty_required = qty_required;
            await existing.save();
            return res.status(200).json(existing);
        }

        const newRecipe = await Recipe.create({
            menu_item_id,
            raw_material_id,
            qty_required
        });
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecipeByMenuItem = async (req, res) => {
    try {
        const { menu_item_id } = req.params;
        const recipes = await Recipe.findAll({
            where: { menu_item_id },
            include: [
                { model: RawMaterial, attributes: ['name', 'unit'] }
            ]
        });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRecipeIngredient = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe ingredient not found.' });
        }
        await recipe.destroy();
        res.status(200).json({ message: 'Recipe ingredient deleted.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
