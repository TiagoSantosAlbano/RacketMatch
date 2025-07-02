const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  date: { type: Date, required: true },
  time: { type: String }, // opcional
  status: { type: String, enum: ['ativa', 'cancelada'], default: 'ativa' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
