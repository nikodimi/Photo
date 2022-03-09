/**
 * Album Controller
 */

const debug = require('debug')('books:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all albums from authenticated user
 */
const index = async (req, res) => {
    // Lazy load the album relation
    await req.user.load('albums');

    res.send({
        status: 'success',
        data: req.user.related('albums')
    })
}

/**
 * Get authenticated users specific album with related photos
 */
const show = async (req, res) => {
    // Get user with all related albums
    const user = await models.User.fetchById(req.user.id, { withRelated: ['albums'] });
    const userAlbums = user.related('albums');

    // Find album with requested id and check if it exists
    const album = userAlbums.find(album => album.id == req.params.albumId);
    if (!album) {
		return res.send({
			status: 'fail',
			data: "Album could not be found",
		});
	}

    // Get the requested album with related photos
    const albumId = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos']});

    res.send({
        status: 'success',
        data: albumId
    });
}

/**
 * Create new album
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
        const album = await new models.Album(validData).save();
        debug('New album created: %O', album);

        res.send({
            status: 'success',
            data: album
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new album'
        });
        throw error;
    }
}

/**
 * Update specific album
 */
const update = async (req, res) => {

    const albumId = req.params.albumId;

    // Check if album exists
    const album = await new models.Album({ id: albumId }).fetch({ require: false });
    if (!album) {
        debug('Album was not found. %o', { id: albumId });
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
        const updatedAlbum = await album.save(validData);
        debug('Updated book successfully: %O', updatedAlbum);

        res.send({
            status: 'success',
            data: updatedAlbum
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating an album'
        });
        throw error;
    }
}

const addPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({
            status: 'fail',
            data: errors.array() });
	}

	// Get the validated data
	const validData = matchedData(req);

	// Fetch album with related photos
	const album = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos'] });

	// Get the albums photos
	const photos = album.related('photos');

	// check if photo is already in the albums's list of photos
	const existingPhoto = photos.find(photo => photo.id == validData.photo_Id);
	if (existingPhoto) {
		return res.send({
			status: 'fail',
			data: 'Photo already exists.',
		});
	}

	try {
		const result = await album.photos().attach(validData.album_Id);
		debug("Added photo to album successfully: %O", result);

		res.send({
			status: 'success',
			data: null,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to a album.',
		});
		throw error;
	}
}

module.exports = {
	index,
	show,
	store,
	update,
    addPhoto
}
