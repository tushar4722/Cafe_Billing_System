const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RawMaterial = sequelize.define('RawMaterial', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING, // e.g., kg, liters, pcs
        allowNull: false,
    },
    current_stock: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    minimum_stock: {
        type: DataTypes.FLOAT,
        defaultValue: 10, // Default minimum stock
    },
});

module.exports = RawMaterial;
