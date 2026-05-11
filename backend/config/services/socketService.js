const { logger } = require('../utils/logger');
const { updateOpenPositions } = require('./tradingEngine');

const setupSocketIO = (io) => {
    // Authentication middleware for socket
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            
            if (!token) {
                // Allow anonymous connections for market data
                socket.userId = null;
                return next();
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        logger.info(`Client connected: ${socket.id}`);

        // Join user-specific room
        if (socket.userId) {
            socket.join(`user_${socket.userId}`);
            logger.info(`User ${socket.userId} joined personal room`);
        }

        // Join market data room
        socket.join('market_data');
        socket.emit('connected', { status: 'connected', socketId: socket.id });

        // Handle subscribe to symbol
        socket.on('subscribe_symbol', (symbol) => {
            socket.join(`symbol_${symbol}`);
            logger.info(`Client ${socket.id} subscribed to ${symbol}`);
        });

        // Handle unsubscribe from symbol
        socket.on('unsubscribe_symbol', (symbol) => {
            socket.leave(`symbol_${symbol}`);
        });

        // Handle trade updates
        socket.on('trade_opened', (data) => {
            if (socket.userId) {
                io.to(`user_${socket.userId}`).emit('position_update', data);
            }
        });

        // Handle chat messages
        socket.on('chat_message', async (data) => {
            try {
                const ChatMessage = require('../models/ChatMessage');
                const message = await ChatMessage.create({
                    user: socket.userId,
                    message: data.message,
                    type: data.type || 'user',
                });

                io.to('support_room').emit('new_chat_message', {
                    id: message._id,
                    user: socket.userId,
                    message: data.message,
                    timestamp: message.createdAt,
                });
            } catch (error) {
                logger.error('Chat message error:', error);
                socket.emit('chat_error', { message: 'Failed to send message' });
            }
        });

        // Handle admin joining support room
        socket.on('join_support', () => {
            socket.join('support_room');
            logger.info(`Support agent joined: ${socket.id}`);
        });

        // Handle typing indicator
        socket.on('typing', (data) => {
            socket.to('support_room').emit('user_typing', {
                userId: socket.userId,
                isTyping: data.isTyping,
            });
        });

        // Handle disconnect
        socket.on('disconnect', (reason) => {
            logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
            
            // Leave all rooms
            if (socket.userId) {
                socket.leave(`user_${socket.userId}`);
            }
        });

        // Handle errors
        socket.on('error', (error) => {
            logger.error(`Socket error for ${socket.id}:`, error);
        });
    });

    // Broadcast market data to all clients every second
    setInterval(async () => {
        try {
            const Market = require('../models/Market');
            const markets = await Market.find({ isActive: true });
            
            const marketData = {};
            markets.forEach(market => {
                // Simulate price movement (in real app, this comes from external API)
                const volatility = 0.0001;
                const randomChange = (Math.random() - 0.5) * volatility * 2;
                
                market.bid += randomChange;
                market.ask = market.bid + market.spread;
                market.change = market.bid - market.previousClose;
                market.changePercent = (market.change / market.previousClose) * 100;
                
                marketData[market.symbol] = {
                    bid: market.bid,
                    ask: market.ask,
                    spread: market.spread,
                    high: market.high,
                    low: market.low,
                    change: market.change,
                    changePercent: market.changePercent,
                    volume: market.volume,
                };

                // Emit to specific symbol room
                io.to(`symbol_${market.symbol}`).emit('price_update', marketData[market.symbol]);
            });

            // Broadcast all market data
            io.to('market_data').emit('market_data', marketData);

            // Update market prices in database periodically
            if (Math.random() < 0.1) { // 10% chance each second
                await Market.updateMany({}, { $set: { lastUpdated: new Date() } });
            }
        } catch (error) {
            logger.error('Market data broadcast error:', error);
        }
    }, 1000);

    // Update open positions every 5 seconds
    setInterval(async () => {
        try {
            await updateOpenPositions(io);
        } catch (error) {
            logger.error('Position update error:', error);
        }
    }, 5000);

    logger.info('Socket.IO service initialized');
};

module.exports = { setupSocketIO };