const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Admin only
router.post('/', [verifyToken, verifyRole(['admin'])], recipeController.addRecipeIngredient);
router.delete('/:id', [verifyToken, verifyRole(['admin'])], recipeController.deleteRecipeIngredient);

// Public or Protected
router.get('/:menu_item_id', [verifyToken], recipeController.getRecipeByMenuItem);

module.exports = router;
