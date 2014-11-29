//
// An Ampersand.js Model representing a photo album.
//

var _ = require('underscore');
var Model = require('ampersand-model');
var Images = require('./images.js');

module.exports = Model.extend({
	idAttribute: 'path',
    props: {
        path: 'string',
        title: 'string',
		description: 'string',
		published: 'boolean', // true: album is available to the public
		image_size: 'string', // a number like 1024 denoting the largest edge of this album's images
		thumb_size: 'string', // a number like 200 denoting both edges of this album's thumbnails
		date: 'date', // in seconds.  Needs to be * 1000 to convert to a Date object
		thumb: 'object',
		parent_album: 'object',
		prev: 'object',
		next: 'object',
		albums: 'array'
    },
	collections: {
		// tells Ampersand to treat the images node in the JSON 
		// response that populates as a collection of Img objects
		images: Images
	},
	derived: {
		// URL (including hashtag) to screen displaying album, like #2014/12-31
		href: {
            deps: ['path'],
            fn: function () {
					return '#'+this.path
			}
		},
		// Type of album:  root, year or week
		type: {
            deps: ['path'],
            fn: function () {
				// no path: it's the root album
				if (!this.path || this.path.length <= 0) {
					return 'root';
				}
				// no slashes:  it's a year album
				else if (this.path.indexOf('/') < 0) {
					return 'year';
				}
				// else it's a subalbum (2005/12-31 or 2005/12-31/snuggery)
				else {
					return 'week';
				}
            }
        },
		childAlbumsByMonth: {
			deps: ['albums'],
			fn: function() {
								
				// Group the child week albums of the year album by month
				var childAlbumsByMonth = _.groupBy(this.albums, function(childAlbum) {
					// create Date object based on album's timestamp
					// multiply by 1000 to turn seconds into milliseconds
					return new Date(childAlbum.date * 1000).getMonth();
				});

				// Put in reverse chronological array
				var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				var byMonthReverse = [];
				for (var i = 11; i >= 0; i--) {
					if (childAlbumsByMonth[i]) {
						var month = {
							monthName: monthNames[i],
							albums: childAlbumsByMonth[i]
						};
						byMonthReverse.push(month);
					}
				}
				return byMonthReverse;
			}
		}
	},
	// the URL of the JSON REST API from which to retrieve the album
	url: function() {
		return 'http://tacocat.com/zenphoto/'+this.path+'?api';
	}
});