'use strict';
/*jslint browser: true*/

var React = require('react');
var ReactDOM = require('react-dom');

var $ = require('jquery');
var AlbumPage = React.createFactory(require('../components/album.jsx'));
var ImagePage = React.createFactory(require('../components/image.jsx'));
var SearchPage = null; // don't create component for the search screen until it's needed
var NotFoundPage = null; // don't create component for the search screen until it's needed

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

		// everything caught by this is a 404
		'*path': 'invalidSyntax'
	},

	/**
	 * Routes that are regular expressions must be defined
	 * via the initialize() function.
	 */
	initialize: function(options) {
		// matches ''
		this.route(/^\/?$/g, 'root');

		// matches 2000
		this.route(/^\/?(\d\d\d\d)\/?$/, 'year');

		// matches 2000/12-31
		this.route(/^\/?((\d\d\d\d)\/\d\d-\d\d)\/?$/, 'month');

		// matches 2001/12-31/some.jpg
		this.route(/^\/?((\d\d\d\d)\/\d\d-\d\d\/[\w\d\-_]+.(jpg|gif|png))\/?$/i, 'photo');
	},

	root: function() {
		var path = '';
		$('body').attr('class', 'root');
		// The key is so that React knows that this is a new component.
		// Otherwise, it'll treat it as an existing component and won't
		// call the component's constructor and componentDidMount(),
		// and thus the new album won't be set and retrieved.
		ReactDOM.render(AlbumPage({albumPath: path, key: path}), mountNode);
		this.track(path);
	},

	year: function(path) {
		$('body').attr('class', 'year' + ' ' + 'y'+path);
		// The key is so that React knows that this is a new component.
		// Otherwise, it'll treat it as an existing component and won't
		// call the component's constructor and componentDidMount(),
		// and thus the new album won't be set and retrieved.
		ReactDOM.render(AlbumPage({albumPath: path, key: path}), mountNode);
		this.track(path);
	},

	month: function(path, year) {
		$('body').attr('class', 'day' + ' ' + 'y'+year);
		// The key is so that React knows that this is a new component.
		// Otherwise, it'll treat it as an existing component and won't
		// call the component's constructor and componentDidMount(),
		// and thus the new album won't be set and retrieved.
		ReactDOM.render(AlbumPage({albumPath: path, key: path}), mountNode);
		this.track(path);
	},

	photo: function(path, year) {
		$('body').attr('class', 'photo' + ' ' + 'y'+year);
		// The key is so that React knows that this is a new component.
		// Otherwise, it'll treat it as an existing component and won't
		// call the component's constructor and componentDidMount(),
		// and thus the new album won't be set and retrieved.
		ReactDOM.render(ImagePage({imagePath: path, key: path}), mountNode);
        this.track(path);
	},

	search: function(searchTerms, returnPath) {
        $('body').attr('class', 'search');
		if (!searchTerms) {
			searchTerms = '';
		}
		if (!returnPath) {
			returnPath = '';
		}
		if (SearchPage === null) {
			SearchPage = React.createFactory(require('../components/search.jsx'));
		}
		ReactDOM.render(SearchPage({searchTerms: searchTerms, returnPath: returnPath, key: searchTerms}), mountNode);
        this.track('search?'+searchTerms);
	},

	invalidSyntax(path) {
		$('body').attr('class', 'search');
		if (NotFoundPage === null) {
			NotFoundPage = React.createFactory(require('../components/notFound.jsx'));
		}
		ReactDOM.render(NotFoundPage({path: path, key: path}), mountNode);
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