var React = require('react');

var RootComponent = React.createFactory(require('./components.js'));
//var components = require('./components.js'); // need to specify the jsx extension

var mountNode = document.getElementById("app");

var AlbumCollection = require('./models/albums.js');
var albums = new AlbumCollection();

var Router = require('ampersand-router'); 
module.exports = Router.extend({ 

  routes: {
    "album/:type":          "album",    // #album/year
    "search/:query":        "search",  // #search/kiwis
    "search/:query/p:page": "search",   // #search/kiwis/p7
	  "": "help" 
  },

  album: function(albumType) {
	  console.log("album");
	  
	  albums.getOrFetch('2014', function (err, model) {
	      if (err) {
	          console.log('error getting album', err);
	      } else {
			  console.log('success getting album', model);
	          // `model` here is a fully inflated model
	          // It gets added to the collection automatically.
	          // If the collection was empty before, it's got 1
	          // now.
	      }
	  });
	  
	  
	  //debugger;
    React.render(RootComponent({albumType : albumType}), mountNode);
  },

  search: function(query, page) {
	  console.log("search");
    React.render(RootComponent({albumType : 'week'}), mountNode);
  }

});