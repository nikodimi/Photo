/**
 * User Controller
 */

const bcrypt = require('bcrypt');
const debug = require('debug')('books:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Register a user
 */
const register = async (req, res) => {
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: 'fail',
            data: errors.array()
        }); 
    }
    
    // Get the validated data
    const validData = matchedData(req);

    // Get a hashed version of the password and overwrite with it
    try {
		validData.password = await bcrypt.hash(validData.password, 10);

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when hashing the password.',
		});
		throw error;
	}

    try {
        const user = await new models.User(validData).save();
        debug('New user created: %O', user);

        res.status(200).send({
            status: 'success',
            data: user
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new user'
        });
        throw error;
    }
}

module.exports = {
	register
}