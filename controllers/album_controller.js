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

    res.status(200).send({
        status: 'success',
        data: {
            albums: req.user.related('albums'),
        }
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
		return res.status(404).send({
			status: 'fail',
			data: "Album could not be found",
		});
	}

    // Get the requested album with related photos
    const albumId = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos']});

    res.status(200).send({
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

        res.status(200).send({
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
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: 'fail',
            data: errors.array() });
    }

    // Get the validated data
    const validData = matchedData(req);

    // Get user with all related albums
    const user = await models.User.fetchById(req.user.id, { withRelated: ['albums'] });
    const userAlbums = user.related('albums');

    // Find album with requested id and check if it exists
    const album = userAlbums.find(album => album.id == req.params.albumId);
    if (!album) {
		return res.status(404).send({
			status: 'fail',
			data: "Album could not be found",
		});
	}

    try {
        const updatedAlbum = await album.save(validData);
        debug('Updated book successfully: %O', updatedAlbum);

        res.status(200).send({
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
    
	// Get user with all the related albums and photos and then get requested id
    const user = await models.User.fetchById(req.user.id, { withRelated: ['albums', 'photos'] });
    const userAlbums = user.related('albums').find(album => album.id == req.params.albumId);
    const userPhotos = user.related('photos').find(photo => photo.id == validData.photo_id);

    // Get album with all the related photos and then get requested id
    const albums = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos']});
	const albumPhotos = albums.related('photos').find(photo => photo.id == validData.photo_id);
    debug('Updated book successfully: %O', userPhotos);

    // Check if album with requested id exists
    if (!userAlbums) {
		return res.status(404).send({
			status: 'fail',
			data: "Album could not be found",
		});
	}

    // Check if photo with requested id exists
    if (!userPhotos) {
        return res.status(404).send({
            status: 'fail',
			data: "photo could not be found",
		});
	}

	// check if photo is already in the albums's list of photos
	if (albumPhotos) {
		return res.status(409).send({
			status: 'fail',
			data: 'Photo already exists.',
		});
	}

	try {
		const result = await albums.photos().attach(validData.photo_id);
		debug("Added photo to album successfully: %O", result);

		res.status(200).send({
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
