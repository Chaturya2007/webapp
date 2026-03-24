const MenuItem = require('../models/MenuItem');

const getAllMenuItems = async (req, res) => {
  try {
    const query = { isAvailable: true };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.isVeg !== undefined) {
      query.isVeg = req.query.isVeg === 'true';
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [{ name: regex }, { description: regex }];
    }

    const items = await MenuItem.find(query).populate('category');
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category');
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMenuItemsByCategory = async (req, res) => {
  try {
    const items = await MenuItem.find({ category: req.params.categoryId, isAvailable: true }).populate('category');
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllMenuItems, getMenuItemById, getMenuItemsByCategory };
