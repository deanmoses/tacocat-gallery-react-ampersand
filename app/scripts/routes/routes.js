var React = require('react');

var AlbumPage = React.createFactory(require('../components/album.jsx'));
var ImagePage = React.createFactory(require('../components/image.jsx'));

// the DOM element into which the entire UI gets written
var mountNode = document.getElementById("main");

/**
 * A collection of photo albums.
 * Is an Ampersand.js Model Collection.
 */
var AlbumCollection = require('../models/albums.js');
var albums = new AlbumCollection();

/**
 * Ampersand.js router.
 *
 * Decides what happens when the app's various URLs are hit.
 */
var Router = require('ampersand-router');
module.exports = Router.extend({ 

	/**
	 * Define the application's routes.
	 *
	 * This maps a URL 'route' expression to a 
	 * javascript function to call when Ampersand.js
	 * detects a matching URL has been entered
	 * into the browser.location.
	 */
	routes: {
		// #2014
		// #2014/12-31
		// #2014/12-31/someSubAlbum
		// #2014/12-31/felix.jpg
		"*path": "albumOrImage",
	},
	
	albumOrImage: function(path) {
		var _this = this;
		if (!path) {
			path = '';
		}
		console.log("router path: '" + path + "'");
		
		var albumPath = path;
		var isPhoto = path.indexOf('.') !== -1;
		if (isPhoto) {
			var pathParts = path.split('/');
			pathParts.pop(); // get rid of filename
			albumPath = pathParts.join('/');
		}
	
		// either get an existing album Model in the Collection,
		// or retrieve it from the server.
		// This is Ampersand Collection.getOrFetch()
		albums.getOrFetch(albumPath, function (err, album) {
			if (err) {
				console.log('error getting album', err);
			} 
			else {
				//console.log('success getting album', album);
								
				// `album` is a fully inflated Ampersand model
				// It gets added to the collection automatically.
				// If the collection was empty before, it's got 1
				// now.
				
				if (isPhoto) {
					React.render(ImagePage({album: album, imagePath: path}), mountNode);
				}
				// else it's an album
				else {
					React.render(AlbumPage({album: album}), mountNode);
				}
			}
		});
	}

});