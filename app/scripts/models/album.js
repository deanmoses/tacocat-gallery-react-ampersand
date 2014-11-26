var Model = require('ampersand-model');

module.exports = Model.extend({
	idAttribute: 'path',
	urlRoot: 'http://tacocat.com/zenphoto/',
    props: {
        path: 'string',
        lastName: 'string'
    },
    derived: {
        fullName: {
            deps: ['firstName', 'lastName'],
            fn: function () {
                return this.firstName + ' ' + this.lastName;
            }
        }
    }
});