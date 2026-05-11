module.exports = {
    // Account Types
    ACCOUNT_TYPES: {
        INDIVIDUAL: 'individual',
        CORPORATE: 'corporate',
        AFFILIATE: 'affiliate',
    },

    // Trading
    TRADE_TYPES: {
        BUY: 'buy',
        SELL: 'sell',
    },
    
    ORDER_TYPES: {
        MARKET: 'market',
        LIMIT: 'limit',
        STOP: 'stop',
    },

    // Transaction Types
    TRANSACTION_TYPES: {
        DEPOSIT: 'deposit',
        WITHDRAWAL: 'withdrawal',
        TRADE_PROFIT: 'trade_profit',
        TRADE_LOSS: 'trade_loss',
        REFERRAL_BONUS: 'referral_bonus',
        AFFILIATE_COMMISSION: 'affiliate_commission',
    },

    // Transaction Status
    TRANSACTION_STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed',
        CANCELLED: 'cancelled',
    },

    // KYC Status
    KYC_STATUS: {
        PENDING: 'pending',
        VERIFIED: 'verified',
        REJECTED: 'rejected',
    },

    // Market Categories
    MARKET_CATEGORIES: {
        FOREX: 'forex',
        COMMODITIES: 'commodities',
        INDICES: 'indices',
        CRYPTO: 'crypto',
    },

    // Payment Methods
    PAYMENT_METHODS: {
        STRIPE: 'stripe',
        PAYPAL: 'paypal',
        SKRILL: 'skrill',
        NETELLER: 'neteller',
        BANK_TRANSFER: 'bank_transfer',
        CRYPTO: 'crypto',
    },

    // User Roles
    ROLES: {
        USER: 'user',
        ADMIN: 'admin',
        SUPER_ADMIN: 'super_admin',
    },

    // Limits
    LIMITS: {
        MIN_DEPOSIT: 100,
        MAX_DEPOSIT: 50000,
        MIN_WITHDRAWAL: 50,
        MAX_WITHDRAWAL: 25000,
        MAX_LEVERAGE: 100,
        MIN_TRADE_VOLUME: 0.01,
        MAX_TRADE_VOLUME: 100,
    },
};