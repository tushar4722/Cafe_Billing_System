const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/login', controller.login);
// router.post('/register', controller.register); // Optional: protected registration

module.exports = router;
