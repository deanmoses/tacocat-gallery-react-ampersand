var Model = require('ampersand-model');

module.exports = Model.extend({
	idAttribute: 'path',
	// ampersand-state defines several built-in datatypes: string, number, boolean, array, object, date, or any
    props: {
        path: 'string',
        title: 'string',
		description: 'string',
		published: 'any', //'boolean', TODO: change to boolean on server
		title: 'string',
		date: 'date',
		thumb: 'object',
		albums: 'array',
		images: 'array'
    },
	// the URL of the JSON REST API from which to retrieve the album
	url: function() {
		return 'http://tacocat.com/zenphoto/'+this.path+'?api';
	}
});