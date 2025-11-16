const { body, param, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Login validation
const validateLogin = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be 3-50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    validate
];

// Post validation
const validatePost = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be 1-200 characters')
        .escape(),
    body('excerpt')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Excerpt must be 1-500 characters')
        .escape(),
    body('content')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Content is required')
        .escape(),
    body('date')
        .isISO8601()
        .withMessage('Invalid date format'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    body('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tag must be 1-50 characters')
        .escape(),
    validate
];

// Post ID validation
const validatePostId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid post ID'),
    validate
];

module.exports = {
    validateLogin,
    validatePost,
    validatePostId
};
