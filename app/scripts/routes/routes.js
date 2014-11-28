var React = require('react');
var _ = require('underscore');

var AlbumPage = React.createFactory(require('../components/album.jsx'));
var ImagePage = React.createFactory(require('../components/photo.jsx'));

var mountNode = document.getElementById("app");

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
		// #image/2014/12-31/felix.jpg
		"image/*path": "image",
		
		// #
		"": "album",
		
		// #album/2014
		// #album/2014/12-31
		// #album/2014/12-31/someSubAlbum
		"album/*path": "album",
	},

	album: function(path) {
		if (!path) {
			path = '';
		}
		console.log("album '" + path + "'");

		// either get an existing album Model in the Collection,
		// or retrieve it from the server.
		// This is Ampersand Collection.getOrFetch()
		albums.getOrFetch(path, function (err, album) {
			if (err) {
				console.log('error getting album', err);
			} 
			else {
				console.log('success getting album', album);
				// `album` is a fully inflated Ampersand model
				// It gets added to the collection automatically.
				// If the collection was empty before, it's got 1
				// now.
				React.render(AlbumPage({album : album}), mountNode);
			}
		});
	},
	
	image: function(path) {
		var _this = this;
		console.log("image '" + path + "'");
		
		var pathParts = path.split('/');
		var imageName = pathParts.pop();
		var albumPath = pathParts.join('/');

		console.log('Router.image: ' + imageName + ' in album ' + albumPath);
		
		// either get an existing album Model in the Collection,
		// or retrieve it from the server.
		// This is Ampersand Collection.getOrFetch()
		albums.getOrFetch(path, function (err, album) {
			if (err) {
				console.log('error getting album', err);
			} 
			else {
				console.log('success getting album', album);
				// `album` is a fully inflated Ampersand model
				// It gets added to the collection automatically.
				// If the collection was empty before, it's got 1
				// now.
				
				var image = _this.getImage(album, path);
				React.render(ImagePage({image : image}), mountNode);
			}
		});
	},
	
		/**
		 * Find an image by its path, like '2014/12-31/flowers.jpg'
		 */
		getImage: function(album, imagePath) {
			return _.find(album.images, function(child) {
				return child.path === imagePath;
			});
		}

});