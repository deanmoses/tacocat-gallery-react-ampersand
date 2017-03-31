'use strict';

//
// An Ampersand.js Model representing a logged in user
//

var Config = require('../config.js');
var Model = require('ampersand-model');
var User = Model.extend({
    props: {
		isAdmin: ['boolean', true /*required*/, false /*defaulted to false*/],
        editMode: ['boolean', false /*never sent from server*/, false /*defaulted to false*/]
	},

	// URL of the JSON REST API from which to retrieve the album
	url: function() {
		return Config.jsonUserUrl();
	},

	// ajaxConfig: fields to set directly on the XHR request object
	// withCredentials: send cross domain requests with authorization headers/cookies. 
	// Useful if you're making cross sub-domain requests with a root-domain auth cookie,
	// such as when the app is served from cdn.tacocat.com but the ajax requests are
	// going to tacocat.com.
	ajaxConfig: function () {
        return {
            xhrFields: {
                'withCredentials': true
            }
        };
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
