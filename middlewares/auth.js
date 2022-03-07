/**
 * Authentication Middleware
 */

const debug = require('debug')('books:auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

/**
 * HTTP Basic Authentication
 */
const basic = async (req, res, next) => {
    debug("Hello from auth.basic!"); 
    
    // Check for authorization header
    if (!req.headers.authorization) {
        debug("No authorization header");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization needed'
        });
    }

    debug("Authorization header: %o", req.headers.authorization);

    // Separate the header into "authSchema" and "base64Payload"
    const [authSchema, base64Payload] = req.headers.authorization.split(' ');

    // Check if authSchema is basic
    if (authSchema.toLowerCase() !== "basic") {
        debug("authSchema is not basic");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization needed'
        });
    }

    // Decode the payload 
    const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii');
    
    // Separate the decoded payload
    const [email, password] = decodedPayload.split(':');

    // Find user based on the email
    const user = await new User({ email }).fetch({ require: false });
    if (!user) {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }
    const hash = user.get('password');

    // compare hashed passwords 
    const result = await bcrypt.compare(password, hash);
    if (!result) {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }

    // finally, attach user to request
    req.user = user;

    // pass request along
    next();
}
    
module.exports = {
    basic,
}





