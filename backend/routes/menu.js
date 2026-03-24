const express = require('express');
const router = express.Router();
const { getAllMenuItems, getMenuItemById, getMenuItemsByCategory } = require('../controllers/menuController');

router.get('/', getAllMenuItems);
router.get('/category/:categoryId', getMenuItemsByCategory);
router.get('/:id', getMenuItemById);

module.exports = router;
