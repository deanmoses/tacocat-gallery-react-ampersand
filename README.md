A prototype HTML5/javascript front end for tacocat.com's photo site.  

Uses the following technologies: 
* [React.js](http://facebook.github.io/react/):  A component-based Javascript View layer that I'm madly in love with.  *So* much easier than Backbone views.  And so fast.
* [Ampersand.js](http://ampersandjs.com/):  Very similiar to Backbone.js but fully embraces tiny modules, npm, and browserify.  I use it for its Models and Routing, not its Views.
* [Browserify](http://browserify.org/):  The first javascript dependency management system that I can actually get working.  I *hate* Require.js, AMD and their ilk.  Browserify does its business using NPM and Node.js and I love it.
* [Gulp.js](http://gulpjs.com/):  A javascript build system that replaces Grunt.js.  Newer, faster, easier to use.

Retrieves album data from a prototype JSON REST backend built on [ZenPhoto](http://www.zenphoto.org/).


## How To Work With Project

### Install stuff for working with project
1. [Git](http://git-scm.com/) - *source control tool.  Needed to retrieve this project from github.com*
2. [Node.js](http://nodejs.org/) - *Node.js server.  Needed to manage development tools & run dev webserver.  Not used at runtime*
3. [Compass](http://compass-style.org/) - *SASS CSS processor* 
 * This will require installing Ruby.  I highly recommend using [RVM](https://rvm.io/) instead installing Ruby directly.
4. [Bower](http://bower.io/) - a javascript package manager.  
 * To install:  `npm install -g bower`


### Install project
1. Open terminal / shell
2. `cd` to directory under which you want to create project
3. Get this project via `git clone [url to this project]`
4. `cd` into project
5. Install the project's npm dependencies: `npm install` *(must be in project root dir)*
6. Install the project's bower dependencies: `bower install` *(must be in project root dir)*
7. Run project: `gulp  watch`.  In the output, it'll tell you what port to open your browser to.
8. The browser will make ajax requests to tacocat.com and it won't be able to.  My preferred solution is the *Allow-Control-Allow-Origin* Google Chrome plugin.
