//
// An Ampersand.js Collection of Img models
//

var Img = require('./image.js');
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
    model: Img
});