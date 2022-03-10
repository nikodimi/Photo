/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

/**
 * Create Photo validation rules
 */
const createRules = [
    body('title').exists().isLength({ min: 3 }),
    body('url').exists().isURL(),
    body('comment').optional().isLength({ min: 3 }),
];

/**
 * Update Photo validation rules
 */
const updateRules = [
    body('title').optional().isLength({ min: 3 }),
    body('url').optional().isURL(),
    body('comment').optional().isLength({ min: 3 }),
];

module.exports = {
    createRules,
    updateRules,
}
 