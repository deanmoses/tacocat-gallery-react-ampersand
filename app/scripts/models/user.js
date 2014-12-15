'use strict';

//
// An Ampersand.js Model representing a logged in user
//

var Config = require('../config.js');
var Model = require('ampersand-model');
var User = Model.extend({
    props: {
		isAdmin: ['boolean', true, false], // required attribute, defaulted to false
        editMode: ['boolean', false, false] // never sent from server, defaulted to false
	},

	// the URL of the JSON REST API from which to retrieve the album
	url: function() {
		return Config.jsonUserUrl();
	}
});

var UserStore = {
	_currentUser: new User({id: 'x'}), // The id doesn't matter, the server doesn't check it

    currentUser: function() {
        return this._currentUser;
    },

	/**
	 * Fetch the user object.  The user will be considered not an admin
	 * until the user object is populated from the server.
	 */
	fetchUser: function() {
		this._currentUser.fetch();
	},

	isAdmin: function() {
		return this._currentUser && this._currentUser.isAdmin;
	}
};

module.exports = UserStore;
