const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  hour: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  courtPrice: { type: Number, default: 0 }, 
  paidPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Match', matchSchema);
