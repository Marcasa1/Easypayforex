const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const adminSchema = new mongoose.Schema({
  firstName: String, lastName: String, email: { type: String, unique: true }, password: String,
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  permissions: [String], isActive: { type: Boolean, default: true },
  wallet: { balance: { type: Number, default: 0 } },
  lastLogin: Date, createdAt: { type: Date, default: Date.now }
});
adminSchema.pre('save', async function(next) { if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10); next(); });
module.exports = mongoose.model('Admin', adminSchema);
