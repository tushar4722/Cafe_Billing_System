const { RawMaterial, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAllRawMaterials = async (req, res) => {
    try {
        const materials = await RawMaterial.findAll();
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRawMaterial = async (req, res) => {
    try {
        const { name, unit, current_stock, minimum_stock } = req.body;
        const newMaterial = await RawMaterial.create({
            name,
            unit,
            current_stock: current_stock || 0,
            minimum_stock: minimum_stock || 10
        });
        res.status(201).json(newMaterial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRawMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, unit, current_stock, minimum_stock } = req.body;
        const material = await RawMaterial.findByPk(id);

        if (!material) {
            return res.status(404).json({ message: 'Raw material not found.' });
        }

        if (name) material.name = name;
        if (unit) material.unit = unit;
        if (current_stock !== undefined) material.current_stock = current_stock;
        if (minimum_stock !== undefined) material.minimum_stock = minimum_stock;

        await material.save();
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRawMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const material = await RawMaterial.findByPk(id);

        if (!material) {
            return res.status(404).json({ message: 'Raw material not found.' });
        }

        await material.destroy();
        res.status(200).json({ message: 'Raw material deleted.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLowStockMaterials = async (req, res) => {
    try {
        const lowStock = await RawMaterial.findAll({
            where: {
                current_stock: {
                    [Op.lt]: sequelize.col('minimum_stock')
                }
            }
        });
        res.status(200).json(lowStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
