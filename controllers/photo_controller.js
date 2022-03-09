/**
 * Photo Controller
 */

 const debug = require('debug')('books:photo_controller');
 const { matchedData, validationResult } = require('express-validator');
 const models = require('../models');
 
 /**
  * Get all photos from authenticated user
  */
 const index = async (req, res) => {
     // eager load the photos relation
     const user = await new models.User({ id: req.user.id }).fetch({ withRelated: ['photos']});
 
     res.send({
        status: 'success',
        data: user.related('photos'),
    })
}
/**
 * Get specific foto from authenticated user
 */
 const show = async (req, res) => {
    // Get user with all related photos
    const user = await models.User.fetchById(req.user.id, { withRelated: ['photos'] });
    const userPhotos = user.related('photos');

    // Find album with requested id and check if it exists
    const photo = userPhotos.find(photo => photo.id == req.params.photoId);
    if (!photo) {
		return res.send({
			status: 'fail',
			data: "Photo could not be found",
		});
	}
    res.send({
        status: 'success',
        data: photo
    });
 }

/**
 * Post new photo
 */
 const store = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: 'fail',
            data: errors.array() });
    }

    // Get the validated data
    const validData = matchedData(req);

    validData.user_id = req.user.id;

    try {
        const photo = await new models.Photo(validData).save();
        debug('New photo created: %O', photo);

        res.send({
            status: 'success',
            data: photo
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new photo'
        });
        throw error;
    }
}

/**
 * Update specific photo
 */
 const update = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: 'fail',
            data: errors.array() });
    }

    // Get the validated data
    const validData = matchedData(req);

    // Get user with all related photos
    const user = await models.User.fetchById(req.user.id, { withRelated: ['photos'] });
    const userPhotos = user.related('photos');

    // Find photo with requested id and check if it exists
    const photo = userPhotos.find(photo => photo.id == req.params.photoId);
    if (!photo) {
		return res.send({
			status: 'fail',
			data: "Photo could not be found",
		});
	}

    try {
        const updatedPhoto = await photo.save(validData);
        debug('Updated photo successfully: %O', updatedPhoto);

        res.send({
            status: 'success',
            data: updatedPhoto
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating an photo'
        });
        throw error;
    }
}

module.exports = {
	index,
	show,
	store,
	update
}
