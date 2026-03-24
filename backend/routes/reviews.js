const express = require('express');
const router = express.Router();
const { createReview, getMenuItemReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, createReview);
router.get('/menu/:menuItemId', getMenuItemReviews);

module.exports = router;
