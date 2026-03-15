const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipe', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    menu_item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'MenuItems', // Table name
            key: 'id',
        },
    },
    raw_material_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'RawMaterials', // Table name
            key: 'id',
        },
    },
    qty_required: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = Recipe;
