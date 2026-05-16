const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./config/email');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Connect to MongoDB (once, at the bottom after all setup)
mongoose.connect('mongodb://localhost:27017/easypayforex')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });

// ========== MODELS ==========
const userSchema = new mongoose.Schema({
  firstName: String, lastName: String,
  email: { type: String, unique: true, sparse: true },
  phoneNumber: String, countryCode: String, password: String,
  accountType: { type: String, enum: ['individual','corporate','affiliate'], default: 'individual' },
  wallet: { balance: { type: Number, default: 10000 }, currency: { type: String, default: 'USD' } },
  tradingAccount: { balance: Number, equity: Number, margin: Number, freeMargin: Number, leverage: { type: Number, default: 50 } },
  kycStatus: { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
  referralCode: String, isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function(next) { if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10); next(); });
const User = mongoose.model('User', userSchema);

const adminSchema = new mongoose.Schema({
  firstName: String, lastName: String, email: { type: String, unique: true }, password: String,
  role: { type: String, enum: ['admin','super_admin'], default: 'admin' },
  permissions: [String], isActive: { type: Boolean, default: true },
  lastLogin: Date, createdAt: { type: Date, default: Date.now }
});
adminSchema.pre('save', async function(next) { if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10); next(); });
const Admin = mongoose.model('Admin', adminSchema);

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symbol: String, type: { type: String, enum: ['buy','sell'] }, volume: Number,
  openPrice: Number, closePrice: Number, stopLoss: Number, takeProfit: Number,
  profit: { type: Number, default: 0 }, status: { type: String, enum: ['open','closed'], default: 'open' },
  openedAt: { type: Date, default: Date.now }, closedAt: Date
});
const Trade = mongoose.model('Trade', tradeSchema);

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit','withdrawal','trade_profit','trade_loss'] },
  amount: Number, paymentMethod: String,
  status: { type: String, enum: ['pending','completed','failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Seed admin
async function seedAdmin() {
  const exists = await Admin.findOne({ email: 'admin@easypayforex.com' });
  if (!exists) {
    await Admin.create({
      firstName: 'Admin', lastName: 'User',
      email: 'admin@easypayforex.com', password: 'Admin123!',
      role: 'super_admin',
      permissions: ['manage_users','manage_trades','manage_transactions','view_reports']
    });
    console.log('✅ Admin created: admin@easypayforex.com / Admin123!');
  }
}

// ========== EXPANDED LIVE MARKET DATA ==========
const markets = {
  // Forex
  'EUR/USD': { price: 1.0850, change: '+0.15%', up: true },
  'GBP/USD': { price: 1.2650, change: '-0.20%', up: false },
  'USD/JPY': { price: 148.50, change: '+0.34%', up: true },
  'USD/CHF': { price: 0.8750, change: '-0.10%', up: false },
  'AUD/USD': { price: 0.6550, change: '+0.05%', up: true },
  'USD/CAD': { price: 1.3450, change: '+0.20%', up: true },
  'NZD/USD': { price: 0.6150, change: '-0.05%', up: false },
  'EUR/GBP': { price: 0.8575, change: '+0.10%', up: true },
  'EUR/JPY': { price: 161.25, change: '+0.75%', up: true },
  'GBP/JPY': { price: 187.80, change: '+0.45%', up: true },

  // Commodities
  'XAU/USD': { price: 2025.50, change: '+0.62%', up: true },
  'XAG/USD': { price: 23.45, change: '-0.25%', up: false },
  'OIL/USD': { price: 72.50, change: '+1.25%', up: true },
  'GAS/USD': { price: 2.45, change: '-0.05%', up: false },
  'COPPER/USD': { price: 3.85, change: '+0.02%', up: true },
  'COTTON/USD': { price: 0.85, change: '-0.01%', up: false },
  'COFFEE/USD': { price: 185.20, change: '+2.10%', up: true },

  // Indices
  'US30': { price: 37500, change: '+0.40%', up: true },
  'SPX500': { price: 4780, change: '+0.53%', up: true },
  'NAS100': { price: 16850, change: '+0.72%', up: true },
  'UK100': { price: 7650, change: '-0.30%', up: false },
  'GER30': { price: 16750, change: '+0.85%', up: true },
  'JPN225': { price: 35750, change: '+0.70%', up: true },
  'AUS200': { price: 7250, change: '+0.15%', up: true },
  'EU50': { price: 4250, change: '+0.40%', up: true },
  'FRA40': { price: 7350, change: '-0.20%', up: false },

  // Cryptocurrencies
  'BTC/USD': { price: 43250, change: '+2.15%', up: true },
  'ETH/USD': { price: 2350, change: '+1.80%', up: true },
  'XRP/USD': { price: 0.52, change: '-0.75%', up: false },
  'LTC/USD': { price: 85.20, change: '+1.20%', up: true },
  'ADA/USD': { price: 0.38, change: '-1.10%', up: false },
  'SOL/USD': { price: 108.50, change: '+3.40%', up: true },
  'DOT/USD': { price: 5.80, change: '+0.90%', up: true },
  'BNB/USD': { price: 310.20, change: '+0.60%', up: true },

  // Stocks (popular US equities)
  'AAPL': { price: 185.50, change: '+1.20%', up: true },
  'MSFT': { price: 420.30, change: '+0.80%', up: true },
  'GOOGL': { price: 142.10, change: '+1.50%', up: true },
  'AMZN': { price: 175.40, change: '+2.10%', up: true },
  'TSLA': { price: 245.60, change: '-3.20%', up: false },
  'META': { price: 510.80, change: '+0.45%', up: true },
  'NVDA': { price: 880.20, change: '+5.20%', up: true },
  'NFLX': { price: 625.30, change: '+0.70%', up: true }
};

// ========== REALISTIC PRICE MOVEMENT LOOP ==========
setInterval(() => {
  Object.keys(markets).forEach(key => {
    const basePrice = markets[key].price;
    let volatility = 0.0005; // default (forex)

    if (key.includes('XAU') || key.includes('XAG')) volatility = 0.002;
    else if (key.includes('OIL') || key.includes('GAS') || key.includes('COPPER')) volatility = 0.003;
    else if (key.includes('BTC') || key.includes('ETH')) volatility = 0.008;
    else if (key.includes('SOL') || key.includes('DOT')) volatility = 0.01;
    else if (/^[A-Z]+$/.test(key) && key.length <= 5) volatility = 0.005; // stocks
    else if (/^\d/.test(key) || ['SPX500','NAS100','US30','UK100','GER30','JPN225','AUS200','EU50','FRA40'].includes(key)) volatility = 0.004; // indices

    const random = (Math.random() - 0.5) * 2;
    const change = random * volatility * basePrice;
    const spike = Math.random() < 0.05 ? (Math.random() - 0.5) * volatility * basePrice * 3 : 0;
    const newPrice = basePrice + change + spike;

    markets[key].price = Math.max(0.01, parseFloat(newPrice.toFixed(
      key.includes('JPY') || key.includes('BTC') ? 2 : 
      key.includes('XAU') || key.includes('SPX') ? 2 : 
      basePrice < 10 ? 4 : 2
    )));
    markets[key].up = change > 0;
    markets[key].change = (change > 0 ? '+' : '') + ((change / basePrice) * 100).toFixed(2) + '%';
  });
  io.emit('marketUpdate', markets);
}, 1000);

// Auth middleware
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
};

const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) return res.status(401).json({ success: false, message: 'Admin not found' });
    next();
  } catch (err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
};

// ========== ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, countryCode, password, accountType } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (exists) return res.status(400).json({ success: false, message: 'User already exists' });
    const user = await User.create({ firstName, lastName, email, phoneNumber, countryCode, password, accountType });
    if (email) sendEmail({ to: email, subject: 'Welcome to EASYPAYFOREX! 🎉', html: `<h1>Welcome ${firstName}!</h1>` }).catch(err => console.error('❌ Email failed:', err.message));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ success: true, token, user: { ...user._doc, password: undefined } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    if (user.email) {
      sendEmail({
        to: user.email,
        subject: 'New Login to Your EASYPAYFOREX Account',
        html: `<h2>Login Alert</h2><p>Your account was just logged into at ${new Date().toLocaleString()}. If this was you, no action is needed. If not, please contact support immediately.</p>`
      }).catch(err => console.error('Login email failed:', err.message));
    }
    res.json({ success: true, token, user: { ...user._doc, password: undefined } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/auth/me', auth, (req, res) => res.json({ success: true, data: req.user }));

// Wallet
app.get('/api/wallet/balance', auth, (req, res) => res.json({ success: true, data: req.user.wallet }));
app.post('/api/wallet/deposit', auth, async (req, res) => {
  if (amount < 50) return res.status(400).json({ success: false, message: 'Minimum deposit amount is $50' });
  const { amount, method } = req.body;
  req.user.wallet.balance += parseFloat(amount);
  await req.user.save();
  await Transaction.create({ user: req.user._id, type: 'deposit', amount, paymentMethod: method });
  if (req.user.email) sendEmail({ to: req.user.email, subject: `Deposit $${amount}`, html: `<p>Deposited $${amount}</p>` }).catch(err => console.error('❌ Email failed:', err.message));
  res.json({ success: true, data: req.user.wallet });
});
app.post('/api/wallet/withdraw', auth, async (req, res) => {
  if (req.user.kycStatus !== "verified") {
    return res.status(400).json({ success: false, message: "KYC verification required to withdraw funds. Please complete verification." });
  }
  const { amount } = req.body;
  if (req.user.wallet.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });
  req.user.wallet.balance -= parseFloat(amount);
  await req.user.save();
  await Transaction.create({ user: req.user._id, type: 'withdrawal', amount });
  if (req.user.email) sendEmail({ to: req.user.email, subject: `Withdrawal $${amount}`, html: `<p>Withdrawn $${amount}</p>` }).catch(err => console.error('❌ Email failed:', err.message));
  res.json({ success: true, data: req.user.wallet });
});
app.get('/api/wallet/transactions', auth, async (req, res) => {
  res.json({ success: true, data: await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }) });
});

// Trading
app.post('/api/trading/open', auth, async (req, res) => {
  const { symbol, type, volume } = req.body;
  const m = markets[symbol];
  if (!m) return res.status(400).json({ success: false, message: 'Invalid symbol' });
  const margin = (volume * m.price * 100000) / req.user.tradingAccount.leverage;
  if (req.user.tradingAccount.freeMargin < margin) return res.status(400).json({ success: false, message: 'Insufficient margin' });
  const trade = await Trade.create({ user: req.user._id, symbol, type, volume, openPrice: m.price, margin });
  req.user.tradingAccount.margin += margin;
  req.user.tradingAccount.freeMargin -= margin;
  await req.user.save();
  res.status(201).json({ success: true, data: trade });
});
app.post('/api/trading/close/:id', auth, async (req, res) => {
  const trade = await Trade.findOne({ _id: req.params.id, user: req.user._id, status: 'open' });
  if (!trade) return res.status(404).json({ success: false, message: 'Trade not found' });
  // Calculate admin fee (1% of profit)
const adminFee = Math.abs(profit) * 0.01;
// Add fee to admin wallet
const admin = await Admin.findOne({ email: 'admin@easypayforex.com' });
if (admin) {
  await admin.save();
}
 
  req.user.tradingAccount.margin -= trade.margin;
  req.user.tradingAccount.freeMargin += trade.margin + profit;
  req.user.wallet.balance += profit;
  await req.user.save();
  res.json({ success: true, data: trade, profit });
});
app.get('/api/trading/positions', auth, async (req, res) => {
  res.json({ success: true, data: await Trade.find({ user: req.user._id, status: 'open' }) });
});
app.get('/api/trading/history', auth, async (req, res) => {
  res.json({ success: true, data: await Trade.find({ user: req.user._id }).sort({ openedAt: -1 }) });
});

// Markets
app.get('/api/markets', (req, res) => res.json({ success: true, data: markets }));

// Admin routes
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await bcrypt.compare(password, admin.password)))
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, token, admin: { ...admin._doc, password: undefined } });
});
app.get('/api/admin/dashboard', adminAuth, async (req, res) => {
  const users = await User.countDocuments();
  const trades = await Trade.countDocuments();
  const deposits = await Transaction.aggregate([{ $match: { type: 'deposit' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
  res.json({ success: true, data: { totalUsers: users, totalTrades: trades, totalDeposits: deposits[0]?.total || 0 } });
});
app.get('/api/admin/users', adminAuth, async (req, res) => {
  res.json({ success: true, data: await User.find().select('-password') });
});
app.put('/api/admin/users/:id', adminAuth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json({ success: true, data: user });
});
app.delete('/api/admin/users/:id', adminAuth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});
app.get('/api/admin/trades', adminAuth, async (req, res) => {
  res.json({ success: true, data: await Trade.find().populate('user', 'firstName lastName email') });
});
app.get('/api/admin/transactions', adminAuth, async (req, res) => {
  res.json({ success: true, data: await Transaction.find().populate('user', 'firstName lastName email') });
});

// Test email
app.post('/api/admin/test-email', adminAuth, async (req, res) => {
  try {
    await sendEmail({ to: req.admin.email, subject: 'Test', html: '<p>Email works!</p>' });
    res.json({ success: true, message: 'Test email sent' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Admin Wallet Routes
app.get('/api/admin/wallet', adminAuth, async (req, res) => {
  const admin = await Admin.findOne({ email: 'admin@easypayforex.com' });
  res.json({ success: true, data: { balance: admin.wallet?.balance || 0 } });
});

app.post('/api/admin/wallet/deposit', adminAuth, async (req, res) => {
  const { amount } = req.body;
  const admin = await Admin.findOne({ email: 'admin@easypayforex.com' });
  admin.wallet.balance += parseFloat(amount);
  await admin.save();
  res.json({ success: true, data: { balance: admin.wallet.balance } });
});

app.post('/api/admin/wallet/withdraw', adminAuth, async (req, res) => {
  const { amount, method } = req.body;
  const admin = await Admin.findOne({ email: 'admin@easypayforex.com' });
  if (admin.wallet.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });
  admin.wallet.balance -= parseFloat(amount);
  await admin.save();
  io.emit('adminNotification', { type: 'withdrawal', amount, method, time: new Date() });
  res.json({ success: true, data: { balance: admin.wallet.balance } });
});

io.on('connection', (socket) => {
  console.log('🟢 Connected:', socket.id);
  socket.emit('marketUpdate', markets);
});

const PORT = process.env.PORT || 5000;
// Start server after MongoDB connects
mongoose.connect('mongodb://localhost:27017/easypayforex')
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedAdmin();
    server.listen(PORT, () => {
      console.log(`🚀 Backend on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });
