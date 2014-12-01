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
		width: 'string', // width of full size image
		height: 'string', // height of full size image
		urlFull: 'string', // like "/zenphoto/albums/2014/11-16/alex1b.jpg"
		urlSized: 'string', // like "/zenphoto/cache/2014/11-16/alex1b_1024.jpg"
		urlThumb: 'string' // like "/zenphoto/cache/2014/11-16/alex1b_200_cw200_ch200_thumb.jpg"
    },
	derived: {
		isPortrait: {
            deps: ['width', 'height'],
            fn: function () {
				return parseInt(this.height) > parseInt(this.width);
			}
		},
		// URL (including hashtag) to screen displaying album, like #2014/12-31/felix.jpg
		href: {
            deps: ['path'],
            fn: function () {
				return '#'+this.path;
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
		
		// URL to next image, including hash
		// Blank if no next image
		nextImageHref: {
            deps: ['next'],
            fn: function () {
				return this.next ? this.next.href : '';
			}
		},
		
		// URL to previous image, including hash
		// Blank if no previous image
		prevImageHref: {
            deps: ['prev'],
            fn: function () {
				return this.prev ? this.prev.href : '';
			}
		}
	}
});




