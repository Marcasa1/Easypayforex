const { body, validationResult } = require('express-validator');

// Validation rules
const registerRules = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
    body('phoneNumber')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number format'),
    body('countryCode')
        .trim()
        .notEmpty().withMessage('Country code is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and number'),
    body('accountType')
        .notEmpty().withMessage('Account type is required')
        .isIn(['individual', 'corporate', 'affiliate']).withMessage('Invalid account type'),
    body('email')
        .optional()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
];

const loginRules = [
    body('password')
        .notEmpty().withMessage('Password is required'),
    body().custom((value, { req }) => {
        if (!req.body.phoneNumber && !req.body.email) {
            throw new Error('Phone number or email is required');
        }
        return true;
    }),
];

const tradeRules = [
    body('symbol')
        .trim()
        .notEmpty().withMessage('Symbol is required')
        .isLength({ min: 6, max: 8 }).withMessage('Invalid symbol format'),
    body('type')
        .notEmpty().withMessage('Trade type is required')
        .isIn(['buy', 'sell']).withMessage('Trade type must be buy or sell'),
    body('volume')
        .notEmpty().withMessage('Volume is required')
        .isFloat({ min: 0.01, max: 100 }).withMessage('Volume must be between 0.01 and 100'),
    body('stopLoss')
        .optional()
        .isFloat({ min: 0 }).withMessage('Stop loss must be positive'),
    body('takeProfit')
        .optional()
        .isFloat({ min: 0 }).withMessage('Take profit must be positive'),
];

const depositRules = [
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: 10, max: 50000 }).withMessage('Amount must be between $10 and $50,000'),
    body('paymentMethod')
        .notEmpty().withMessage('Payment method is required')
        .isIn(['stripe', 'paypal', 'skrill', 'neteller', 'bank_transfer'])
        .withMessage('Invalid payment method'),
    body('currency')
        .optional()
        .isIn(['USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
];

const withdrawalRules = [
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: 50, max: 25000 }).withMessage('Amount must be between $50 and $25,000'),
    body('paymentMethod')
        .notEmpty().withMessage('Payment method is required'),
];

// Validate middleware
const validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({
            field: err.path,
            message: err.msg
        }));

        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: extractedErrors
        });
    };
};

module.exports = {
    registerRules,
    loginRules,
    tradeRules,
    depositRules,
    withdrawalRules,
    validate,
};