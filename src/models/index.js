const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const MenuItem = require('./MenuItem');
const RawMaterial = require('./RawMaterial');
const Recipe = require('./Recipe');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations

// Recipe belongs to MenuItem and RawMaterial
MenuItem.hasMany(Recipe, { foreignKey: 'menu_item_id' });
Recipe.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

RawMaterial.hasMany(Recipe, { foreignKey: 'raw_material_id' });
Recipe.belongsTo(RawMaterial, { foreignKey: 'raw_material_id' });

// Order contains multiple items
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// OrderItem links to MenuItem
MenuItem.hasMany(OrderItem, { foreignKey: 'menu_item_id' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

module.exports = {
    sequelize,
    User,
    MenuItem,
    RawMaterial,
    Recipe,
    Order,
    OrderItem,
};
