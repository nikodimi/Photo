/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

/**
 * Create Album validation rules
 */
const createRules = [
	body('title').exists().isLength({ min: 3 }),
];

/**
 * Update Album validation rules
 */
const updateRules = [
	body('title').exists().isLength({ min: 3 }),
];

module.exports = {
	createRules,
	updateRules,
}
