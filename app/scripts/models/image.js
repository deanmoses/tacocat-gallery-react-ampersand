//
// An Ampersand.js State class (i.e. a Model) representing an image.
//

var _ = require('underscore');
var AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
	idAttribute: 'path',
    props: {
        path: 'string', // like "2014/11-16/alex1b.jpg"
        title: 'string', // like "Alex Jumps"
		description: 'string',
		date: 'date', // in seconds.  Needs to be * 1000 to convert to a Date object
		urlFull: 'string', // like "/zenphoto/albums/2014/11-16/alex1b.jpg"
		urlSized: 'string', // like "/zenphoto/cache/2014/11-16/alex1b_1024.jpg"
		urlThumb: 'string' // like "/zenphoto/cache/2014/11-16/alex1b_200_cw200_ch200_thumb.jpg"
    },
	derived: {
		// URL linking to this image's page
		urlPage: {
            deps: ['path'],
            fn: function () {
				return '#image/'+this.path;
			}
		},
		
		// next image
		next: {
            deps: ['path', 'collection'],
            fn: function () {
				// I don't know my own index in my parent collection, so
				// first I have to find myself, then find the next image.
				// collection = the parent collection of images I'm in.
				var myPath = this.path;
				var foundMyself = false;
				return _.find(this.collection.models, function(img) {
					if (foundMyself) {
						return true; // returning true on the image AFTER me
					} 
					else if (img.path === myPath) {
						foundMyself = true;
					}
				});
			}
		},
		
		// previous image
		prev: {
            deps: ['path', 'collection'],
            fn: function () {
				// I don't know my own index in my parent collection.
				// But I do know that once I find myself, I will have
				// already found my prev in the previous iteration.
				// collection = the parent collection of images I'm in.
				var myPath = this.path;
				var prev;
				_.find(this.collection.models, function(img) {
					if (img.path === myPath) {
						return true;
					}
					prev = img;
				});
				return prev;
			}
		},
	}
});




