const Review = require('../models/Review');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

const createReview = async (req, res) => {
  try {
    const { orderId, menuItemId, rating, comment } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Can only review delivered orders' });
    }

    const existingReview = await Review.findOne({ order: orderId, menuItem: menuItemId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'Review already exists for this item in this order' });
    }

    const review = await Review.create({
      user: req.user._id,
      order: orderId,
      menuItem: menuItemId,
      rating,
      comment
    });

    const allReviews = await Review.find({ menuItem: menuItemId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await MenuItem.findByIdAndUpdate(menuItemId, {
      'rating.average': Math.round(avgRating * 10) / 10,
      'rating.count': allReviews.length
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMenuItemReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ menuItem: req.params.menuItemId })
      .populate('user', 'name');
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createReview, getMenuItemReviews };
