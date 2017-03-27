'use strict';

//
// configuration global to the entire gallery app
//

module.exports = {

	site_title: 'Dean, Lucie, Felix and Milo Moses',

    site_title_short: 'The Moses Family',

    dev: function() {
      return (document.location.hostname.toLowerCase() === 'localhost');
    },

	zenphotoBaseUrl: function() {
		return 'https://tacocat.com/zenphoto/';
	},

	zenphotoImageFullSizeUrl: function(imagePath) {
		return 'https://tacocat.com/zenphoto/albums/' + imagePath;
	},

	zenphotoImageViewUrl: function(imagePath) {
		return 'https://tacocat.com/zenphoto/' + imagePath;
	},

	zenphotoImageEditUrl: function(albumPath, imageFilename) {
        var zeditUrl = 'https://tacocat.com/zenphoto/zp-core/admin-edit.php?page=edit&tab=imageinfo&album=ALBUM_PATH&image=IMAGE_FILENAME#IT';
		return zeditUrl.replace('ALBUM_PATH', encodeURIComponent(albumPath)).replace('IMAGE_FILENAME', encodeURIComponent(imageFilename));
	},

    zenphotoAlbumViewUrl: function(albumPath) {
        // Not having the final slash messes up POSTing to the edit URL, 
        // because as of late 2016 zenphoto started redirecting 
        // to the version with the slash.
        var finalSlash = albumPath.endsWith('/') ? '' : '/';
        return 'https://tacocat.com/zenphoto/' + albumPath + finalSlash;
    },

    zenphotoAlbumEditUrl: function(albumPath) {
        return 'https://tacocat.com/zenphoto/zp-core/admin-edit.php?page=edit&album=' + encodeURIComponent(albumPath);
    },

    mockBaseUrl: 'mockdata',

    jsonAlbumEditUrl: function(albumPath) {
        return this.dev() ? this.mockBaseUrl + '/album/save.json' : this.zenphotoAlbumViewUrl(albumPath);
    },

    jsonUserUrl: function() {
        return this.dev() ? this.mockBaseUrl + '/user/read.json' : 'https://tacocat.com/zenphoto/?api&auth';
    },

    staticAlbumUrl: function(albumPath) {
        // format: 2001/12-31
        // new format: 2001/12/31
        return 'https://tacocat.com/pix/' + albumPath.split('-').join('/') + '/';
    }
};