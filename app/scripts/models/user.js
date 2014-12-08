'use strict';

//
// An Ampersand.js Model representing a logged in user
//

var Model = require('ampersand-model');
var User = Model.extend({
    props: {
		isAdmin: ['boolean', true, false], // required attribute, defaulted to false
	},

	// the URL of the JSON REST API from which to retrieve the album
	url: function() {
		return 'http://tacocat.com/zenphoto/?api&auth';
	}
});

var UserStore = {
	currentUser: null,
	
	/**
	 * Fetch the user object.  The user will be considered not an admin
	 * until the user object is populated from the server.
	 */
	fetchUser: function() {
		// The id doesn't matter, the server doesn't check it
		this.currentUser = new User({id: 'x'});
		this.currentUser.fetch();
	},
	
	isAdmin: function() {
		debugger;
		return this.currentUser && this.currentUser.isAdmin;
	}
};

module.exports = UserStore;