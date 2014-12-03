'use strict';

//
// An Ampersand.js Collection of Album models
//

var Collection = require('ampersand-rest-collection');
var Album = require('./album.js');

module.exports = Collection.extend({
    model: Album
});