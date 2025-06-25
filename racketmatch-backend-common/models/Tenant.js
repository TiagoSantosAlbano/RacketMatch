const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String 
  },
  phone: { 
    type: String 
  },
  commissionRate: { 
    type: Number, 
    default: 15 
  }, // Cada tenant pode ter a sua própria comissão (ex: 15%, 10%, etc)
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Tenant', tenantSchema);
