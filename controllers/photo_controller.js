/**
 * Album Controller
 */

 const debug = require('debug')('books:photo_controller');
 const { matchedData, validationResult } = require('express-validator');
 const models = require('../models');
 
 /**
  * Get all photos 
  */
 const index = async (req, res) => {
     const allPhotos = await models.Photo.fetchAll();
 
     res.send({
         status: 'success',
         data: {
             albums: allPhotos
         }
     })
 }

/**
 * Get specific photo with related albums
 */
 const show = async (req, res) => {
    const photo = await new models.Photo({ id:req.params.photoId })
        .fetch({ withRelated: ['albums']});
    
    res.send({
        status: 'success',
        data: {
            photo
        }
    });
}

/**
 * Create new photo
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
    const photoId = req.params.photoId;

    // Check if album exists
    const photo = await new models.Photo({ id: photoId }).fetch({ require: false });
    if (!photo) {
        debug('Album was not found. %o', { id: photoId });
        res.status(404).send({
            status: 'fail',
            data: 'Album not found'
        });
        return;
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: 'fail',
            data: errors.array() });
    }

    // Get the validated data
    const validData = matchedData(req);

    try {
        const updatedPhoto = await photo.save(validData);
        debug('Updated book successfully: %O', updatedPhoto);

        res.send({
            status: 'success',
            data: photo
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
