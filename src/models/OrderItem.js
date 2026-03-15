const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Orders',
            key: 'id',
        },
    },
    menu_item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'MenuItems',
            key: 'id',
        },
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        type: DataTypes.FLOAT, // Snapshot of price at time of order
        allowNull: false,
    },
});

module.exports = OrderItem;
