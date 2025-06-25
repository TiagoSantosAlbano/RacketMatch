const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Chat', chatSchema);
