const { Order, RawMaterial, MenuItem, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Sales (only count fully paid orders)
        const salesData = await Order.findAll({
            where: { payment_status: 'paid' },
            attributes: [
                [sequelize.fn('sum', sequelize.col('total_amount')), 'totalSales'],
                [sequelize.fn('count', sequelize.col('id')), 'totalOrders']
            ],
            raw: true
        });

        const totalSales = salesData[0].totalSales || 0;
        const totalOrders = salesData[0].totalOrders || 0;

        // 2. Low Stock Count
        const lowStockCount = await RawMaterial.count({
            where: {
                current_stock: {
                    [Op.lt]: sequelize.col('minimum_stock')
                }
            }
        });

        // 3. Live & Recent Orders (All pending + 5 most recent completed/cancelled)
        const pendingOrders = await Order.findAll({
            where: { status: 'pending' },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'total_amount', 'status', 'createdAt']
        });

        const otherOrders = await Order.findAll({
            where: { status: { [Op.ne]: 'pending' } },
            limit: 5, // Always show 5 recent history items
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'total_amount', 'status', 'createdAt']
        });

        const recentOrders = [...pendingOrders, ...otherOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            totalSales,
            totalOrders,
            lowStockCount,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
