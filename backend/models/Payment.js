const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  method: { type: String, enum: ['cod', 'upi'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  amount: { type: Number, required: true },
  upiId: { type: String },
  transactionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
