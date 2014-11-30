/**
 * The singular global store of photo albums.  
 * 
 * Stores all the albums fetched from the server, 
 * so that when the user navigates back to a previously 
 * viewed album, it already exists and there's no
 * request back to the server.
 *
 * In the pre-require() days, I would have stored this as a global variable.
 *
 * This is an Ampersand.js Collection of Models.
 */
var AlbumCollection = require('./models/albums.js');
module.exports = new AlbumCollection();