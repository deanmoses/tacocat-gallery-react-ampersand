'use strict';

var gulp = require('gulp');
var gulputil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var del = require('del');
var path = require('path');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var cleanCss = require('gulp-clean-css');
var minifyHtml = require('gulp-minify-html');
var filesize = require('gulp-filesize');
var buffer = require('gulp-buffer');
var rsync = require('gulp-rsync');
var useref = require('gulp-useref');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var manifest = require('gulp-manifest');

// Load plugins
var $ = require('gulp-load-plugins')();

// true: production build: minify
var prod = false;

// Set production = true
gulp.task('setprod', function() {
    prod = true;
    process.env.NODE_ENV = 'production'; // Needed to build the prod version of React, they say it's much faster
});


// Compile SASS stylesheets
gulp.task('styles', function () {
    return sass('app/styles/main.scss', {
        style: 'expanded',
        precision: 10,
        loadPath: ['app/bower_components']
    })
    .pipe($.autoprefixer('last 1 version'))
	.pipe(gulpif(prod, cleanCss({compatibility: 'ie8'})))
    .pipe(gulp.dest('dist/styles'))
    .pipe($.size());
});


// Check javascript for code style
gulp.task('jshint', function() {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(jshint())
	.pipe(jshint.reporter(stylish))
	.pipe(jshint.reporter('fail'))
});


// Check jsx for code style
gulp.task('jsxhint', function() {
  return gulp.src('./app/scripts/**/*.jsx')
	.pipe(react())
    .pipe(jshint({"quotmark": false, "latedef": false})) // jshint options to ignore in JSX files
	.pipe(jshint.reporter(stylish))
	.pipe(jshint.reporter('fail'))
});


// Scripts
gulp.task('scripts', function () {
    var opts = {
        noparse: ['jquery'], // shave a little time off builds by telling browserify to not parse these files for require() statements
        debug: !prod // add a source map inline to the end of the bundle. This makes debugging easier because you can see all the original files if you are in a modern enough browser.
    };
    return browserify('./app/scripts/app.js', opts)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist/scripts'))
});


// HTML
gulp.task('html', function () {
    return gulp.src('app/*.html')
		.pipe(gulpif(prod, minifyHtml({conditionals:true})))
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});


// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});


// Copy files at the root of the app
gulp.task('copyrootfiles', function() {
	gulp.src(['app/.htaccess','app/manifest.json','app/browserconfig.xml','app/robots.txt'])
	.pipe(gulp.dest('dist'));
});


// Copy fonts
gulp.task('copyfonts', function() {
   gulp.src('app/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/**/*.{ttf,woff,eof,svg}')
   .pipe(gulp.dest('dist/fonts/bootstrap'));
});


// Copy mock JSON
gulp.task('copymockdata', function() {
    gulp.src('mockdata/**/*.*')
        .pipe(gulp.dest('dist/mockdata'));
});


// Create an application cache manifest
gulp.task('manifest', function() {
    gulp.src(['dist/index.html','dist/scripts/**/*.js', 'dist/styles/**/*.css', 'dist/fonts/**/*.{ttf,woff,woff2,eof,svg}'], {base: 'dist'})
        .pipe(manifest({
            timestamp: true,
            network: ['*'],
            filename: 'a.appcache',
            exclude: 'a.appcache'
        }))
        .pipe(gulp.dest('dist'));
});


// Jest tests
gulp.task('jest', function() {
    var nodeModules = path.resolve('./node_modules');
    return gulp.src('app/scripts/**/__tests__')
        .pipe($.jest({
            scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
            unmockedModulePathPatterns: [nodeModules + '/react']
        }));
});


// Clean
gulp.task('clean', function(cb) {
    del(['dist/styles', 'dist/fonts', 'dist/scripts', 'dist/images', 'dist/mockdata'], cb);
});


// Bundle
gulp.task('bundle', ['styles', 'copyfonts', 'copyrootfiles', 'copymockdata', /*'manifest',*/ 'scripts'], function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});


// Watch
gulp.task('watch', ['html', 'bundle', 'serve'], function() {

    // Watch .html files
    gulp.watch('app/*.html', ['html']);

    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['jshint', 'scripts', 'jest' ]);

	// Watch .jsx files
	gulp.watch('app/scripts/components/**/*.jsx', ['jsxhint', 'scripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);

    // Watch mock JSON data
    gulp.watch('mockdata/**/*', ['copymockdata']);
});

// Build
gulp.task('build', ['html', 'bundle', 'images']);


// Minify Javascript
gulp.task('minifyjs', function () {
  return gulp.src('dist/scripts/**/*.js')
    .pipe(uglify().on('error', function(err) {
        gulputil.log(gulputil.colors.red('[Error]'), err.toString());
        this.emit('end');
        }))
    .pipe(gulp.dest('dist/scripts'));
});

// Deploy to remote server
gulp.task('deploy', function() {
	gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist',
		hostname: 'tacocat.com',
		destination: '~/themosii.com/p2',
		recursive: true,
		//clean: true, // delete all files and directories that are not in the source paths. Be careful with this option as it could lead to data loss.
		progress: true // the transfer progress for each file will be displayed in the console
	}));
});

// Release
gulp.task('release', ['setprod', 'build', 'manifest', 'minifyjs']);

// Default task
gulp.task('default', ['clean', 'build', 'jest' ]);

// Webserver
gulp.task('serve', function () {
    gulp.src('dist')
        .pipe($.webserver({
            livereload: true,
            port: 9000
        }));
});