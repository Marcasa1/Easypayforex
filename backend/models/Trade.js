const mongoose = require('mongoose');
const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symbol: String, type: { type: String, enum: ['buy', 'sell'] }, volume: Number,
  openPrice: Number, closePrice: Number, stopLoss: Number, takeProfit: Number,
  profit: { type: Number, default: 0 }, status: { type: String, enum: ['open', 'closed'], default: 'open' },
  openedAt: { type: Date, default: Date.now }, closedAt: Date
});
module.exports = mongoose.model('Trade', tradeSchema);
