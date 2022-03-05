/*
* Register Validation Rules
*/
const { body } = require('express-validator');
const models = require('../models');

/**
 * Create the rules for user registration
 */
const createRules = [
    body('email').exists().isEmail().isLength({ min: 3 }).custom(async value => {
        const email = await new models.User({ email: value }).fetch({ require: false });
        if (email) {
            return Promise.reject('A user with this email already exists');
        }
        return Promise.resolve();
    }),
    body('password').isLength({ min: 6 }),
    body('first_name').isLength({ min: 3 }),
    body('last_name').isLength({ min: 3 })
];

module.exports = {
	createRules
}