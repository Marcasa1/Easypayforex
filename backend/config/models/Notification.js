const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: [
            'trade_opened',
            'trade_closed',
            'deposit',
            'withdrawal',
            'kyc',
            'system',
            'promotion',
            'alert',
            'ai_signal',
        ],
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    readAt: Date,
    actionUrl: String,
    metadata: mongoose.Schema.Types.Mixed,
    expiresAt: Date,
}, {
    timestamps: true,
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });

// Auto-expire notifications after 30 days
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
