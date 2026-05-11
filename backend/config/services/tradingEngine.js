const Trade = require('../models/Trade');
const Market = require('../models/Market');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const { TRADE_TYPES } = require('../config/constants');
const { logger } = require('../utils/logger');

// Calculate margin for a trade
const calculateMargin = (volume, price, leverage) => {
    return (volume * price * 100000) / leverage;
};

// Calculate pip value
const calculatePipValue = (symbol) => {
    const pipSizes = {
        'EUR/USD': 0.0001,
        'GBP/USD': 0.0001,
        'AUD/USD': 0.0001,
        'NZD/USD': 0.0001,
        'USD/CAD': 0.0001,
        'USD/CHF': 0.0001,
        'USD/JPY': 0.01,
        'EUR/JPY': 0.01,
        'GBP/JPY': 0.01,
        'XAU/USD': 0.01,
        'XAG/USD': 0.01,
        'OIL/USD': 0.01,
        'US30': 1,
        'SPX500': 0.1,
        'NAS100': 0.1,
        'UK100': 0.1,
        'GER30': 0.1,
    };

    return pipSizes[symbol] || 0.0001;
};

// Calculate profit/loss for a position
const calculateProfitLoss = (trade, currentPrice) => {
    const pipValue = calculatePipValue(trade.symbol);
    let pointsDiff;

    if (trade.type === TRADE_TYPES.BUY) {
        pointsDiff = currentPrice - trade.openPrice;
    } else {
        pointsDiff = trade.openPrice - currentPrice;
    }

    const pips = pointsDiff / pipValue;
    const profit = pips * trade.volume * 10; // Simplified calculation

    return {
        pips,
        profit,
        currentPrice,
    };
};

// Update all open positions with current market prices
const updateOpenPositions = async (io) => {
    try {
        const openPositions = await Trade.find({ status: 'open' });

        for (const position of openPositions) {
            const market = await Market.findOne({ symbol: position.symbol });
            
            if (!market) continue;

            const currentPrice = position.type === TRADE_TYPES.BUY ? market.bid : market.ask;
            const { pips, profit } = calculateProfitLoss(position, currentPrice);

            // Update position
            position.currentPrice = currentPrice;
            position.floatingProfit = profit;
            position.pips = pips;
            await position.save();

            // Check stop loss and take profit
            await checkSLTP(position, currentPrice);

            // Emit real-time update to user
            if (io) {
                io.to(`user_${position.user}`).emit('position_update', {
                    positionId: position._id,
                    symbol: position.symbol,
                    currentPrice,
                    floatingProfit: profit,
                    pips,
                });
            }
        }
    } catch (error) {
        logger.error('Update open positions error:', error);
    }
};

// Check Stop Loss and Take Profit
const checkSLTP = async (position, currentPrice) => {
    let shouldClose = false;
    let closeReason = '';

    if (position.type === TRADE_TYPES.BUY) {
        // For buy positions
        if (position.stopLoss && currentPrice <= position.stopLoss) {
            shouldClose = true;
            closeReason = 'stop_loss';
        }
        if (position.takeProfit && currentPrice >= position.takeProfit) {
            shouldClose = true;
            closeReason = 'take_profit';
        }
    } else {
        // For sell positions
        if (position.stopLoss && currentPrice >= position.stopLoss) {
            shouldClose = true;
            closeReason = 'stop_loss';
        }
        if (position.takeProfit && currentPrice <= position.takeProfit) {
            shouldClose = true;
            closeReason = 'take_profit';
        }
    }

    if (shouldClose) {
        await closePositionAutomatically(position, currentPrice, closeReason);
    }
};

// Auto-close position
const closePositionAutomatically = async (position, closePrice, reason) => {
    try {
        position.closePrice = closePrice;
        position.status = 'closed';
        position.closedAt = new Date();
        position.closeReason = reason;
        await position.save();

        // Update wallet
        const wallet = await Wallet.findOne({ user: position.user });
        if (position.profit >= 0) {
            await wallet.deposit(Math.abs(position.profit));
        } else {
            await wallet.withdraw(Math.abs(position.profit));
        }
        await wallet.unlockFunds(position.margin);

        // Update user account
        const user = await User.findById(position.user);
        user.tradingAccount.margin -= position.margin;
        user.tradingAccount.balance = wallet.balance;
        await user.save();

        // Send notification
        await Notification.create({
            user: position.user,
            title: 'Position Closed',
            message: `${position.symbol} closed at ${closePrice} (${reason.replace('_', ' ')})`,
            type: 'trade_closed',
            priority: 'high',
            metadata: { tradeId: position._id, reason }
        });

        logger.info(`Position ${position._id} auto-closed: ${reason}`);
    } catch (error) {
        logger.error('Auto-close position error:', error);
    }
};

// Check margin calls
const checkMarginCalls = async () => {
    try {
        const users = await User.find({ 'tradingAccount.marginLevel': { $gt: 0 } });

        for (const user of users) {
            const marginLevel = user.tradingAccount.marginLevel;
            
            if (marginLevel < 50) {
                // Margin call - close worst performing positions
                const positions = await Trade.find({ user: user._id, status: 'open' })
                    .sort({ floatingProfit: 1 });
                
                let positionsToClose = [];
                for (const position of positions) {
                    if (user.tradingAccount.marginLevel >= 50) break;
                    
                    positionsToClose.push(position._id);
                    user.tradingAccount.margin -= position.margin;
                    user.tradingAccount.freeMargin += position.margin;
                }

                // Close positions
                for (const positionId of positionsToClose) {
                    const position = await Trade.findById(positionId);
                    if (position) {
                        const market = await Market.findOne({ symbol: position.symbol });
                        if (market) {
                            const closePrice = position.type === TRADE_TYPES.BUY ? market.bid : market.ask;
                            await closePositionAutomatically(position, closePrice, 'margin_call');
                        }
                    }
                }

                // Notify user
                await Notification.create({
                    user: user._id,
                    title: 'Margin Call',
                    message: 'Some positions were closed due to insufficient margin',
                    type: 'system',
                    priority: 'high',
                });
            }
        }
    } catch (error) {
        logger.error('Check margin calls error:', error);
    }
};

// Calculate swap (overnight interest)
const calculateSwap = (position) => {
    const swapRates = {
        'EUR/USD': { long: -0.5, short: -0.2 },
        'GBP/USD': { long: -0.3, short: -0.4 },
        'XAU/USD': { long: -2.0, short: -1.5 },
    };

    const rates = swapRates[position.symbol] || { long: -0.5, short: -0.5 };
    const swapRate = position.type === TRADE_TYPES.BUY ? rates.long : rates.short;
    
    return (position.volume * swapRate) / 365;
};

module.exports = {
    calculateMargin,
    calculatePipValue,
    calculateProfitLoss,
    updateOpenPositions,
    checkMarginCalls,
    calculateSwap,
    checkSLTP,
};
