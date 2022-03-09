/**
 * User model
 */

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'users',
        photos() {
            return this.hasMany('Photo')
        },
        albums() {
            return this.hasMany('Album')
        }
	}, {
        async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		},
    });
};
