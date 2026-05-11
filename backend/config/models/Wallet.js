const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
        min: 0,
    },
    lockedBalance: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    ewalletAccounts: [{
        provider: {
            type: String,
            enum: ['paypal', 'skrill', 'neteller', 'payoneer'],
        },
        email: String,
        accountId: String,
        isVerified: {
            type: Boolean,
            default: false,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    }],
    paymentMethods: [{
        type: {
            type: String,
            enum: ['credit_card', 'debit_card', 'bank_account', 'crypto_wallet'],
        },
        provider: String,
        last4: String,
        expiryDate: String,
        isDefault: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        metadata: mongoose.Schema.Types.Mixed,
    }],
    totalDeposited: {
        type: Number,
        default: 0,
    },
    totalWithdrawn: {
        type: Number,
        default: 0,
    },
    lastTransaction: Date,
}, {
    timestamps: true,
});

// Methods
walletSchema.methods.deposit = async function(amount) {
    this.balance += amount;
    this.totalDeposited += amount;
    this.lastTransaction = new Date();
    return this.save();
};

walletSchema.methods.withdraw = async function(amount) {
    if (this.balance < amount) {
        throw new Error('Insufficient balance');
    }
    this.balance -= amount;
    this.totalWithdrawn += amount;
    this.lastTransaction = new Date();
    return this.save();
};

walletSchema.methods.lockFunds = async function(amount) {
    if (this.balance < amount) {
        throw new Error('Insufficient balance to lock');
    }
    this.balance -= amount;
    this.lockedBalance += amount;
    return this.save();
};

walletSchema.methods.unlockFunds = async function(amount) {
    if (this.lockedBalance < amount) {
        throw new Error('Insufficient locked balance');
    }
    this.lockedBalance -= amount;
    this.balance += amount;
    return this.save();
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
