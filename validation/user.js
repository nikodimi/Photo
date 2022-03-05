/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

/**
 * Create User validation rules
 */
const createRules = [
    body('title').exists().isLength({ min: 4 }),
];

/**
 * Update User validation rules
 */
const updateRules = [
    body('title').optional().isLength({ min: 4 }),
];

module.exports = {
    createRules,
    updateRules,
}
 