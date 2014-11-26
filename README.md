Prototype HTML5 front end for tacocat.com's photo site using the following technologies: 
* [React.js](http://facebook.github.io/react/) - A component-based Javascript View layer that I'm madly in love with.  *So* much easier than Backbone views.  And so fast.
* [Ampersand.js](http://ampersandjs.com/) - Very similiar to Backbone.js but fully embraces tiny modules, npm, and browserify.  I use it for its Models and Routing, not its Views.
* [Browserify](http://browserify.org/) - the first javascript dependency management system that I can actually get working.  I *hate* AMD and Require.js and their ilk.  Browserify does its business using NPM and Node.js and I love it.
* [Gulp.js](http://gulpjs.com/) - javascript build system that replaces Grunt.js.  Is newer, faster, easier to use.

Retrieves album data from a prototype JSON REST backend built on [ZenPhoto](http://www.zenphoto.org/) 


## How To Work With Project

### Install stuff for working with project
1. [Git](http://git-scm.com/) - *source control tool.  Needed to retrieve this project from github.com*
2. [Node.js](http://nodejs.org/) - *Node.js server.  Needed to manage development tools & run dev webserver.  Not used at runtime*
3. [Compass](http://compass-style.org/) - *SASS CSS processor* 
 * This will require installing Ruby.  I highly recommend using [RVM](https://rvm.io/) instead installing Ruby directly.
