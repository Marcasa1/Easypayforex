const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { PAYMENT_METHODS, TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../config/constants');
const { processPayment, processWithdrawal } = require('../services/paymentService');
const { logger } = require('../utils/logger');
const stripe = require('../config/stripe');

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
exports.getBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ user: req.user.id });
        
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                balance: wallet.balance,
                lockedBalance: wallet.lockedBalance,
                totalBalance: wallet.balance + wallet.lockedBalance,
                currency: wallet.currency,
                totalDeposited: wallet.totalDeposited,
                totalWithdrawn: wallet.totalWithdrawn
            }
        });
    } catch (error) {
        logger.error('Get balance error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch balance'
        });
    }
};

// @desc    Deposit funds
// @route   POST /api/wallet/deposit
exports.deposit = async (req, res) => {
    try {
        const { amount, paymentMethod, currency = 'USD' } = req.body;

        // Validate amount
        if (amount < 10) {
            return res.status(400).json({
                success: false,
                message: 'Minimum deposit amount is $10'
            });
        }

        if (amount > 50000) {
            return res.status(400).json({
                success: false,
                message: 'Maximum deposit amount is $50,000'
            });
        }

        // Create transaction
        const transaction = await Transaction.create({
            user: req.user.id,
            type: TRANSACTION_TYPES.DEPOSIT,
            amount,
            fee: 0,
            netAmount: amount,
            currency,
            paymentMethod,
            status: TRANSACTION_STATUS.PENDING,
            metadata: {
                paymentMethod,
                currency
            }
        });

        // Process payment based on method
        let paymentResult;
        
        if (paymentMethod === PAYMENT_METHODS.STRIPE) {
            paymentResult = await processPayment(amount, currency, paymentMethod, {
                userId: req.user.id,
                transactionId: transaction.transactionId
            });
        } else if (paymentMethod === PAYMENT_METHODS.PAYPAL) {
            paymentResult = await processPayment(amount, currency, paymentMethod, {
                userId: req.user.id,
                transactionId: transaction.transactionId,
                returnUrl: `${process.env.FRONTEND_URL}/wallet/callback`,
                cancelUrl: `${process.env.FRONTEND_URL}/wallet`
            });
        }

        // Update transaction
        transaction.paymentDetails = {
            provider: paymentMethod,
            transactionRef: paymentResult?.id || paymentResult?.transactionId
        };
        await transaction.save();

        res.status(200).json({
            success: true,
            data: {
                transaction,
                paymentUrl: paymentResult?.url,
                clientSecret: paymentResult?.clientSecret
            },
            message: 'Deposit initiated'
        });
    } catch (error) {
        logger.error('Deposit error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process deposit'
        });
    }
};

// @desc    Withdraw funds
// @route   POST /api/wallet/withdraw
exports.withdraw = async (req, res) => {
    try {
        const { amount, paymentMethod, accountDetails } = req.body;

        // Validate amount
        if (amount < 50) {
            return res.status(400).json({
                success: false,
                message: 'Minimum withdrawal amount is $50'
            });
        }

        // Check balance
        const wallet = await Wallet.findOne({ user: req.user.id });
        if (wallet.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance'
            });
        }

        // Calculate fee
        const fee = amount * 0.02; // 2% withdrawal fee
        const netAmount = amount - fee;

        // Create transaction
        const transaction = await Transaction.create({
            user: req.user.id,
            type: TRANSACTION_TYPES.WITHDRAWAL,
            amount,
            fee,
            netAmount,
            currency: 'USD',
            paymentMethod,
            status: TRANSACTION_STATUS.PENDING,
            paymentDetails: {
                provider: paymentMethod,
                accountEmail: accountDetails?.email,
                accountName: accountDetails?.name
            }
        });

        // Lock funds for withdrawal
        await wallet.lockFunds(amount);

        // Process withdrawal
        try {
            const withdrawalResult = await processWithdrawal(netAmount, paymentMethod, accountDetails);

            // Complete withdrawal
            await wallet.withdraw(amount);
            await wallet.unlockFunds(amount - amount); // Reset lock

            transaction.status = TRANSACTION_STATUS.COMPLETED;
            transaction.completedAt = new Date();
            await transaction.save();

            // Notify user
            await Notification.create({
                user: req.user.id,
                title: 'Withdrawal Successful',
                message: `$${netAmount.toFixed(2)} has been sent to your ${paymentMethod} account`,
                type: 'withdrawal',
                priority: 'high'
            });

            res.status(200).json({
                success: true,
                data: transaction,
                message: 'Withdrawal successful'
            });
        } catch (withdrawalError) {
            // Unlock funds on failure
            await wallet.unlockFunds(amount);
            
            transaction.status = TRANSACTION_STATUS.FAILED;
            transaction.failureReason = withdrawalError.message;
            await transaction.save();

            throw withdrawalError;
        }
    } catch (error) {
        logger.error('Withdrawal error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to process withdrawal'
        });
    }
};

// @desc    Get transactions
// @route   GET /api/wallet/transactions
exports.getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20, type, status, startDate, endDate } = req.query;

        const query = { user: req.user.id };

        if (type) query.type = type;
        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                transactions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        logger.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transactions'
        });
    }
};

// @desc    Add e-wallet account
// @route   POST /api/wallet/ewallet
exports.addEWallet = async (req, res) => {
    try {
        const { provider, email, accountId, isDefault } = req.body;

        const wallet = await Wallet.findOne({ user: req.user.id });

        // Check if already exists
        const existingAccount = wallet.ewalletAccounts.find(
            acc => acc.provider === provider && acc.email === email
        );

        if (existingAccount) {
            return res.status(400).json({
                success: false,
                message: 'E-wallet account already exists'
            });
        }

        // If default, remove default from others
        if (isDefault) {
            wallet.ewalletAccounts.forEach(acc => acc.isDefault = false);
        }

        wallet.ewalletAccounts.push({
            provider,
            email,
            accountId,
            isDefault: isDefault || false
        });

        await wallet.save();

        res.status(200).json({
            success: true,
            data: wallet.ewalletAccounts,
            message: 'E-wallet account added successfully'
        });
    } catch (error) {
        logger.error('Add e-wallet error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add e-wallet account'
        });
    }
};

// @desc    Stripe webhook handler
// @route   POST /api/wallet/stripe-webhook
exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        logger.error('Stripe webhook signature verification failed:', err);
        return res.status(400).json({
            success: false,
            message: 'Webhook signature verification failed'
        });
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            await handleSuccessfulPayment(paymentIntent);
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            await handleFailedPayment(failedPayment);
            break;
        default:
            logger.info(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};

// Helper function to handle successful payment
async function handleSuccessfulPayment(paymentIntent) {
    try {
        const transaction = await Transaction.findOne({
            'paymentDetails.transactionRef': paymentIntent.id
        });

        if (!transaction) {
            logger.error('Transaction not found for payment:', paymentIntent.id);
            return;
        }

        transaction.status = TRANSACTION_STATUS.COMPLETED;
        transaction.completedAt = new Date();
        await transaction.save();

        // Update wallet
        const wallet = await Wallet.findOne({ user: transaction.user });
        await wallet.deposit(transaction.netAmount);

        // Notify user
        await Notification.create({
            user: transaction.user,
            title: 'Deposit Successful',
            message: `$${transaction.netAmount.toFixed(2)} has been added to your wallet`,
            type: 'deposit',
            priority: 'high'
        });
    } catch (error) {
        logger.error('Handle successful payment error:', error);
    }
}

// Helper function to handle failed payment
async function handleFailedPayment(paymentIntent) {
    try {
        const transaction = await Transaction.findOne({
            'paymentDetails.transactionRef': paymentIntent.id
        });

        if (transaction) {
            transaction.status = TRANSACTION_STATUS.FAILED;
            transaction.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
            await transaction.save();
        }
    } catch (error) {
        logger.error('Handle failed payment error:', error);
    }
}
