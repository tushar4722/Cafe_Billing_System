const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Admin and Kitchen (maybe)
router.get('/', [verifyToken, verifyRole(['admin', 'kitchen'])], inventoryController.getAllRawMaterials);
router.get('/low-stock', [verifyToken, verifyRole(['admin', 'kitchen'])], inventoryController.getLowStockMaterials);

// Admin only
router.post('/', [verifyToken, verifyRole(['admin'])], inventoryController.createRawMaterial);
router.put('/:id', [verifyToken, verifyRole(['admin'])], inventoryController.updateRawMaterial);
router.delete('/:id', [verifyToken, verifyRole(['admin'])], inventoryController.deleteRawMaterial);

module.exports = router;
