'use strict';

//
// An Ampersand.js Model representing a photo album.
//

var _ = require('underscore');
var DateUtils = require('../utils/date.js');
var Model = require('ampersand-model');
var Images = require('./images.js');
module.exports = Model.extend({
	idAttribute: 'path',
    props: {
        path: 'string',
        title: 'string',
		description: 'string',
		unpublished: 'boolean', // true: album is NOT available to the public
		image_size: 'string', // a number like 1024 denoting the largest edge of this album's images
		thumb_size: 'string', // a number like 200 denoting both edges of this album's thumbnails
		date: 'date', // in seconds.  Needs to be * 1000 to convert to a Date object
		thumb: 'object',
		parent_album: 'object',
		prev: 'object',
		next: 'object',
		latest: 'object', // most recent album.  Only supplied with the root album.
		albums: 'array'
    },
	collections: {
		// tells Ampersand to treat the images node in the JSON 
		// response that populates as a collection of Img objects
		images: Images
	},
	derived: {
		published: {
            deps: ['unpublished'],
            fn: function () {
				// unpublished may be undefined, we test for that OR false
				return !this.unpublished;
			}
		},
		// URL (including hashtag) to screen displaying album, like #2014/12-31
		href: {
            deps: ['path'],
            fn: function () {
				return '#'+this.path;
			}
		},
		// Path of next album
		// Blank if no next album
		nextAlbumPath: {
            deps: ['next'],
            fn: function () {
				return this.next ? this.next.path : '';
			}
		},
		// URL to next album, including hash
		// Blank if no next album
		nextAlbumHref: {
            deps: ['next'],
            fn: function () {
				return this.next ? '#'+this.next.path : '';
			}
		},
		// Path of prev album
		// Blank if no previous album
		prevAlbumPath: {
            deps: ['prev'],
            fn: function () {
				return this.prev ? this.prev.path : '';
			}
		},
		// URL to previous album, including hash
		// Blank if no previous album
		prevAlbumHref: {
            deps: ['prev'],
            fn: function () {
				return this.prev ? '#'+this.prev.path : '';
			}
		},
		// URL to parent album, including hash
		// Blank if no parent album
		parentAlbumHref: {
            deps: ['parent_album'],
            fn: function () {
				return this.parent_album ? '#'+this.parent_album.path : '';
			}
		},
		// Title of next album
		// Blank if no next album
		nextAlbumTitle: {
            deps: ['next','type'],
            fn: function () {
				if (!this.next) {
					return '';
				}
				else if (this.type === 'year') {
					return DateUtils.year(this.next.date);
				}
				else {
					return DateUtils.shortDate(this.next.date);
				}
			}
		},
		// Title of previous album
		// Blank if no previous album
		prevAlbumTitle: {
            deps: ['prev','type'],
            fn: function () {
				if (!this.prev) {
					return '';
				}
				else if (this.type === 'year') {
					return DateUtils.year(this.prev.date);
				}
				else {
					return DateUtils.shortDate(this.prev.date);
				}
			}
		},
		// Title of parent album
		// Blank if no parent album
		parentAlbumTitle: {
            deps: ['parent_album'],
            fn: function () {
				return this.parent_album ? this.parent_album.title : '';
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
		// Title of album
		pageTitle: {
            deps: ['type', 'title', 'date'],
            fn: function () {
				switch (this.type) {
					case 'root':
						return '';
					case 'year':
						return DateUtils.year(this.date);
					case 'week':
						var month_names = new Array('January', 'February', 'March', 
						'April', 'May', 'June', 'July', 'August', 'September', 
						'October', 'November', 'December');

						var d = new Date(this.date*1000);
						var curr_day = d.getDate();
						var curr_month = d.getMonth();
						var curr_year = d.getFullYear();
						return month_names[curr_month] + ' ' + curr_day + ', ' + curr_year;
					default:
						throw 'no such type: ' + this.type;
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