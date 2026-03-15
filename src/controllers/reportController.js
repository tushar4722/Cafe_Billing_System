const { Order, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getSalesReport = async (req, res) => {
    try {
        const { from, to } = req.query;

        // Validate dates
        const startDate = from ? new Date(from) : new Date(new Date().setDate(new Date().getDate() - 30));
        const endDate = to ? new Date(to) : new Date();

        // Group by date
        // Note: SQL syntax for date grouping depends on dialect. MySQL: DATE(created_at)
        const salesData = await Order.findAll({
            where: {
                status: 'completed',
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalSales'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount']
            ],
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
            raw: true
        });

        res.status(200).json(salesData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
