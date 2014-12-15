'use strict';

var React = require('react');

var $ = require('jquery');
var AlbumPage = React.createFactory(require('../components/album.jsx'));
var ImagePage = React.createFactory(require('../components/image.jsx'));
var SearchPage = null; // don't create component for the search screen until it's needed

// the DOM element into which the React.js components are mounted
/*global document*/
var mountNode = document.getElementById('main');

/**
 * Ampersand.js router.
 *
 * Decides what happens when the app's various URLs are hit.
 */
var Router = require('ampersand-router');
module.exports = Router.extend({

	/*global console*/

	/**
	 * Define the application's routes.
	 *
	 * This maps a URL 'route' expression to a
	 * javascript function to call when Ampersand.js
	 * detects a matching URL has been entered
	 * into the browser.location.
	 */
	routes: {
		// #search:cat&return:2014/12-13
		'search:*searchTerms&return:*returnPath': 'search',
		// #search:cat
		'search:*searchTerms': 'search',

		// #2014
		// #2014/12-31
		// #2014/12-31/someSubAlbum
		// #2014/12-31/felix.jpg
		'*path': 'albumOrImage'
	},

	search: function(searchTerms, returnPath) {
		if (!searchTerms) {
			searchTerms = '';
		}
		if (!returnPath) {
			returnPath = '';
		}
		//console.log('router search: "' + searchTerms + '"  "' + returnPath + '"');
		if (SearchPage === null) {
			SearchPage = React.createFactory(require('../components/search.jsx'));
		}
		React.render(SearchPage({searchTerms: searchTerms, returnPath: returnPath, key: searchTerms}), mountNode);
	},

	albumOrImage: function(path) {
		if (!path) {
			path = '';
		}
		//console.log('router path: "' + path + '"');

        if (!path || path.indexOf('/') >=0) {
            $('body').removeAttr('class');
        }
        else {
            $('body').attr('class', 'y'+path);
        }

		// It's an album path if there's no '.' in the path.
		// This is not robust, but it's safe enough because
		// I know i've never created an album with a '.' in
		// the name.
		var isAlbum = path.indexOf('.') === -1;

		// render album page
		if (isAlbum) {
			// The key is so that React knows that this is a new component.
			// Otherwise, it'll treat it as an existing component and won't
			// call the component's getInitialState() and componentDidMount(),
			// and thus the new album won't be set and retrieved.
			React.render(AlbumPage({albumPath: path, key: path}), mountNode);
		}
		// else render photo page
		else {
			// The key is so that React knows that this is a new component.
			// Otherwise, it'll treat it as an existing component and won't
			// call the component's getInitialState() and componentDidMount(),
			// and thus the new album won't be set and retrieved.
			React.render(ImagePage({imagePath: path, key: path}), mountNode);
		}
	}

});
