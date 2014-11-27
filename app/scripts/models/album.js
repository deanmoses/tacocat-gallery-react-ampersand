
var _ = require('underscore');
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
	derived: {
		
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
				
				debugger;
				
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