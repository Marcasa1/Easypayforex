const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit', 'withdrawal', 'trade_profit', 'trade_loss'] },
  amount: Number, paymentMethod: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Transaction', transactionSchema);
