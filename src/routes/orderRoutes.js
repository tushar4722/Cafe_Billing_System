const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Cashier/Admin can create orders
router.post('/', [verifyToken], orderController.createOrder);

// Admin/Kitchen/Cashier can view
router.get('/', [verifyToken], orderController.getOrders);

// Kitchen/Admin can update status
router.put('/:id', [verifyToken, verifyRole(['admin', 'kitchen'])], orderController.updateOrderStatus);

// Cashier/Admin can update payment status
router.put('/:id/payment', [verifyToken, verifyRole(['admin', 'cashier'])], orderController.updatePaymentStatus);

// Staff/Admin can add items to an existing order
router.post('/:id/items', [verifyToken], orderController.addItemsToOrder);

module.exports = router;
