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
var AlbumCollection = require('./albums.js');
var albums = new AlbumCollection();
module.exports = albums;

/**
 * Get album that's already been fetched.
 *
 * This is needed because Ampersand Collections don't handle
 * models with a null ID, and that's what our root album has.
 */
albums.getAlbum = function(path) {
  if (!path) {
    return this.rootAlbum;
  }
  else {
      return this.get(path);
  }
};

/**
 * Fetch album from server.
 *
 * This is needed because Ampersand Collections don't handle
 * models with a null ID, and that's what our root album has.
 */
albums.fetchAlbum = function(path, cb) {
    this.fetchById(path, function (err, album) {
        // store root album
        if (!err && !path) {
            this.rootAlbum = album;
        }

        if (cb) {
            cb(err, album);
        }
    }.bind(this));
};
