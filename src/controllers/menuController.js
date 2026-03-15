const { MenuItem } = require('../models');

exports.getAllMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMenuItem = async (req, res) => {
    try {
        const { name, price, category, image, isAvailable } = req.body;
        const newItem = await MenuItem.create({ name, price, category, image, isAvailable });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, image, isAvailable } = req.body;
        const item = await MenuItem.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Menu item not found.' });
        }

        item.name = name || item.name;
        item.price = price || item.price;
        item.category = category || item.category;
        item.image = image || item.image;
        if (isAvailable !== undefined) item.isAvailable = isAvailable;

        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await MenuItem.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Menu item not found.' });
        }

        await item.destroy();
        res.status(200).json({ message: 'Menu item deleted.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
