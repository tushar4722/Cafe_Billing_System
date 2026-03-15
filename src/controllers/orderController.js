const { Order, OrderItem, MenuItem, Recipe, RawMaterial, sequelize } = require('../models');

exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items, payment_method, table_no, payment_status } = req.body; // items: [{ menu_item_id, qty }]

        // 1. Calculate Total & Prepare Order Data
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const menuItem = await MenuItem.findByPk(item.menu_item_id);
            if (!menuItem) {
                throw new Error(`Menu item with ID ${item.menu_item_id} not found.`);
            }
            const itemTotal = menuItem.price * item.qty;
            totalAmount += itemTotal;
            orderItemsData.push({
                menu_item_id: item.menu_item_id,
                qty: item.qty,
                price: menuItem.price
            });
        }

        // 2. Create Order
        const order = await Order.create({
            total_amount: totalAmount,
            status: 'pending',
            payment_method,
            table_no: table_no || null,
            payment_status: payment_status || 'pending'
        }, { transaction: t });

        // 3. Create Order Items
        for (const data of orderItemsData) {
            await OrderItem.create({
                order_id: order.id,
                ...data
            }, { transaction: t });

            // 4. Inventory Deduction Logic
            const recipes = await Recipe.findAll({
                where: { menu_item_id: data.menu_item_id }
            });

            for (const recipe of recipes) {
                await RawMaterial.decrement(
                    { current_stock: recipe.qty_required * data.qty },
                    {
                        where: { id: recipe.raw_material_id },
                        transaction: t
                    }
                );
            }
        }

        await t.commit();

        // 5. Fetch complete order with details for Socket.IO
        const fullOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    include: [{ model: MenuItem, attributes: ['name'] }]
                }
            ]
        });

        // 6. Real-time Update
        if (req.io) {
            req.io.emit('newOrder', fullOrder);
        }

        res.status(201).json(fullOrder);

    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        // Optional query params for status or date
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    include: [{ model: MenuItem, attributes: ['name'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        order.status = status;
        await order.save();

        if (req.io) {
            req.io.emit('orderStatusUpdated', { id: order.id, status: order.status });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status, payment_method } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        order.payment_status = payment_status;
        if (payment_method) {
            order.payment_method = payment_method;
        }
        await order.save();

        if (req.io) {
            // Emit the updated order with full details
            const fullOrder = await Order.findByPk(order.id, {
                include: [
                    {
                        model: OrderItem,
                        include: [{ model: MenuItem, attributes: ['name'] }]
                    }
                ]
            });
            req.io.emit('orderPaymentUpdated', fullOrder);
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addItemsToOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { items } = req.body; // items: [{ menu_item_id, qty }]

        const order = await Order.findByPk(id, { transaction: t });
        if (!order) {
            throw new Error('Order not found.');
        }

        if (order.status === 'completed' || order.payment_status === 'paid') {
            throw new Error('Cannot add items to a finalized or paid order.');
        }

        let additionalTotal = 0;
        const orderItemsData = [];

        // 1. Calculate Total & Prepare New Items Data
        for (const item of items) {
            const menuItem = await MenuItem.findByPk(item.menu_item_id);
            if (!menuItem) {
                throw new Error(`Menu item with ID ${item.menu_item_id} not found.`);
            }
            const itemTotal = menuItem.price * item.qty;
            additionalTotal += itemTotal;
            orderItemsData.push({
                order_id: order.id,
                menu_item_id: item.menu_item_id,
                qty: item.qty,
                price: menuItem.price
            });
        }

        // 2. Add Order Items and Update Inventory
        for (const data of orderItemsData) {
            await OrderItem.create(data, { transaction: t });

            const recipes = await Recipe.findAll({
                where: { menu_item_id: data.menu_item_id }
            });

            for (const recipe of recipes) {
                await RawMaterial.decrement(
                    { current_stock: recipe.qty_required * data.qty },
                    {
                        where: { id: recipe.raw_material_id },
                        transaction: t
                    }
                );
            }
        }

        // 3. Update the Order Total
        order.total_amount += additionalTotal;
        await order.save({ transaction: t });

        await t.commit();

        // 4. Fetch the fully updated order for realtime emit
        const fullOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    include: [{ model: MenuItem, attributes: ['name'] }]
                }
            ]
        });

        if (req.io) {
            req.io.emit('orderItemsAdded', fullOrder);
        }

        res.status(200).json(fullOrder);

    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};
