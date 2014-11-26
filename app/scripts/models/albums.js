var Collection = require('ampersand-rest-collection');
var Album = require('./album.js');

module.exports = Collection.extend({
    model: Album
});