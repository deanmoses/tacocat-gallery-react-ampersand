'use strict';
/*jslint browser: true*/

var React = require('react');
var ReactDOM = require('react-dom');

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
    /*global gtag */

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
        $('body').attr('class', 'search');

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
		ReactDOM.render(SearchPage({searchTerms: searchTerms, returnPath: returnPath, key: searchTerms}), mountNode);
        this.track('search?'+searchTerms);
	},

	albumOrImage: function(path) {
		if (!path) {
			path = '';
		}
		//console.log('router path: "' + path + '"');

        // It's an album path if there's no '.' in the path.
        // This is not robust, but it's safe enough because
        // I know i've never created an album with a '.' in
        // the name.
        var isAlbum =  path.indexOf('.') === -1;
        var year;

        // root album
        if (!path) {
            $('body').attr('class', 'root');
        }
        // individual photo
        else if (!isAlbum) {
            year = path.split('/')[0];
            $('body').attr('class', 'photo' + ' ' + 'y'+year);
        }
        // day album
        else if (path.indexOf('/') >=0) {
            year = path.split('/')[0];
            $('body').attr('class', 'day' + ' ' + 'y'+year);
        }
        // year album
        else {
            $('body').attr('class', 'year' + ' ' + 'y'+path);
        }

		// render album page
		if (isAlbum) {
			// The key is so that React knows that this is a new component.
			// Otherwise, it'll treat it as an existing component and won't
			// call the component's constructor and componentDidMount(),
			// and thus the new album won't be set and retrieved.
			ReactDOM.render(AlbumPage({albumPath: path, key: path}), mountNode);
		}
		// else render photo page
		else {
			// The key is so that React knows that this is a new component.
			// Otherwise, it'll treat it as an existing component and won't
			// call the component's constructor and componentDidMount(),
			// and thus the new album won't be set and retrieved.
			ReactDOM.render(ImagePage({imagePath: path, key: path}), mountNode);
		}
        this.track(path);
	},

	/**
	 * Send path to Google Analytics
	 */
    track(path) {
		gtag('event', 'screen_view', { 
			'screen_name': path
		});
    }

});