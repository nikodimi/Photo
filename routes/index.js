const express = require('express');
const router = express.Router();

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/albums', require('./albums'));
router.use('/photos', require('./photos'));
router.use('/users', require('./users'));

module.exports = router;
