const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    payment_method: {
        type: DataTypes.STRING, // e.g., cash, card, upi
        allowNull: true,
    },
    table_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'paid'),
        defaultValue: 'pending',
    },
});

module.exports = Order;
