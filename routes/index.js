const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/albums', require('./albums'));
router.use('/photos', require('./photos'));

router.post('/register', userValidationRules.createRules, userController.register);

module.exports = router;
