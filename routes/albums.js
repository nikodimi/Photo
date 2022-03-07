const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');

/* Get all albums */
router.get('/', albumController.index);

/* Get a specific album */
router.get('/:albumId', albumController.show);

/* Store a new album */
router.post('/', albumValidationRules.createRules, albumController.store);

/* Update a specific album */
router.put('/:albumId', albumValidationRules.updateRules, albumController.update);

router.post('/:albumId/photos', albumController.addPhoto);

module.exports = router;
