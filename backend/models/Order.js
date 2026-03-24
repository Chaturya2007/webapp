const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String }
}, { _id: false });

const deliveryAddressSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String },
  pincode: { type: String },
  phone: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  orderType: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], required: true },
  tableNumber: { type: String },
  deliveryAddress: deliveryAddressSchema,
  pickupTime: { type: Date },
  paymentMethod: { type: String, enum: ['cod', 'upi'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  upiTransactionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
