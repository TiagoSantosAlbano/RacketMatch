const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skill_level: { type: Number, required: true },
  isPremium: { type: Boolean, default: false },
  premiumSince: { type: Date },
  preferredLocations: { type: [String], required: true },
  preferredTimes: { type: [String], required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  lastSeen: { type: Date, default: Date.now },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
