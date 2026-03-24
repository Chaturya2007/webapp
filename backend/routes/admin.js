const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
  getAdminMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getUsers,
  getReviews,
  getAnalytics
} = require('../controllers/adminController');

router.use(auth, adminAuth);

router.get('/dashboard', getDashboard);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/menu', getAdminMenuItems);
router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);
router.get('/categories', getAdminCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/users', getUsers);
router.get('/reviews', getReviews);
router.get('/analytics', getAnalytics);

module.exports = router;
