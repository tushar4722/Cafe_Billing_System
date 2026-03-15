const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Public
router.get('/', menuController.getAllMenuItems);

// Admin only
router.post('/', [verifyToken, verifyRole(['admin'])], menuController.createMenuItem);
router.put('/:id', [verifyToken, verifyRole(['admin'])], menuController.updateMenuItem);
router.delete('/:id', [verifyToken, verifyRole(['admin'])], menuController.deleteMenuItem);

module.exports = router;
