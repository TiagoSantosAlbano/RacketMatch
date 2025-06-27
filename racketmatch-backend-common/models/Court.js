const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: [String], default: [] },
  price: { type: Number, default: 0 },
  image: { type: String, required: false },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Court', courtSchema);
