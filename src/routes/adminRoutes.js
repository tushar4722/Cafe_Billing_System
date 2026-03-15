const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.get('/stats', [verifyToken, verifyRole(['admin'])], adminController.getDashboardStats);

// User Management Routes
router.get('/users', [verifyToken, verifyRole(['admin'])], userController.getAllUsers);
router.post('/users', [verifyToken, verifyRole(['admin'])], userController.createUser);
router.put('/users/:id', [verifyToken, verifyRole(['admin'])], userController.updateUser);
router.delete('/users/:id', [verifyToken, verifyRole(['admin'])], userController.deleteUser);

module.exports = router;
