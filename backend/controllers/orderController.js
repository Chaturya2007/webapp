const Order = require('../models/Order');
const Payment = require('../models/Payment');

const createOrder = async (req, res) => {
  try {
    const { items, orderType, tableNumber, deliveryAddress, pickupTime, paymentMethod } = req.body;

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = orderType === 'delivery' ? 40 : 0;
    const totalAmount = subtotal + tax + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      items,
      orderType,
      tableNumber,
      deliveryAddress,
      pickupTime,
      paymentMethod,
      subtotal,
      tax,
      deliveryFee,
      totalAmount
    });

    req.io.emit('new-order', order);

    await Payment.create({
      order: order._id,
      user: req.user._id,
      method: paymentMethod,
      amount: totalAmount
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.menuItem');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.menuItem');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById, cancelOrder };
