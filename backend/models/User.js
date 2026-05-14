const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  firstName: String, lastName: String,
  email: { type: String, unique: true, sparse: true },
  phoneNumber: { type: String, unique: true }, countryCode: String,
  password: String,
  accountType: { type: String, enum: ['individual', 'corporate', 'affiliate'], default: 'individual' },
  wallet: { balance: { type: Number, default: 10000 }, currency: { type: String, default: 'USD' } },
  tradingAccount: { balance: Number, equity: Number, margin: Number, freeMargin: Number, leverage: { type: Number, default: 50 } },
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  referralCode: String, isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function(next) { if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10); next(); });
module.exports = mongoose.model('User', userSchema);
