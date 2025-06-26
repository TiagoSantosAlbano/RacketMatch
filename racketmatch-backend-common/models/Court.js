// backend/models/Court.js

const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: [String], // array de strings
  },
  price: {
    type: Number,
  },
  // image: {
  //   type: String, // pode ser uma URL ou path local
  //   required: false,
  // },
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Court', courtSchema);
