const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  matchPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalPrice: { type: Number, required: true },
  commission: { type: Number, required: true },
  clubRevenue: { type: Number, required: true },
  day: { type: Date, required: true },
  hour: { type: String, required: true },
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
