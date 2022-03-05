// Setting up the database connection
const knex = require('knex')({
	debug: true,
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 3306,
		charset: process.env.DB_CHARSET || 'utf8mb4',
		database: process.env.DB_NAME || 'photo',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || 'mysql',
	}
});

const bookshelf = require('bookshelf')(knex);

const models = {};
models.Example = require('./Example')(bookshelf);

module.exports = {
	bookshelf,
	...models,
};
