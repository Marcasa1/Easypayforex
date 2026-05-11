const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { getRedisClient } = require('../config/redis');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth rate limiter (more strict)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 login/register attempts per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Trading rate limiter
const tradingLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // Limit each user to 30 trades per minute
    message: {
        success: false,
        message: 'Too many trading requests, please slow down.'
    },
    keyGenerator: (req) => {
        return req.user ? req.user.id : req.ip;
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Withdrawal rate limiter
const withdrawalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each user to 3 withdrawals per hour
    message: {
        success: false,
        message: 'Too many withdrawal requests, please try again later.'
    },
    keyGenerator: (req) => {
        return req.user ? req.user.id : req.ip;
    },
});

// Redis-based rate limiter for production
const createRedisLimiter = (options) => {
    try {
        const redisClient = getRedisClient();
        if (redisClient) {
            return rateLimit({
                ...options,
                store: new RedisStore({
                    sendCommand: (...args) => redisClient.call(...args),
                }),
            });
        }
    } catch (error) {
        console.warn('Redis not available, using memory store for rate limiting');
    }
    return rateLimit(options);
};

module.exports = {
    apiLimiter,
    authLimiter,
    tradingLimiter,
    withdrawalLimiter,
    createRedisLimiter,
};
