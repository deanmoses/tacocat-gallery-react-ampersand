'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var filesize = require('gulp-filesize');
var buffer = require('gulp-buffer');
var rsync = require('gulp-rsync');

// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// true: production build: minify
var prod = false;

// Set production = true
gulp.task('setprod', function() {
    prod = true;
});


// Compile SASS stylesheets
gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['app/bower_components']
        }))
        .pipe($.autoprefixer('last 1 version'))
		.pipe(gulpif(prod, minifyCss()))
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
    return browserify('./app/scripts/app.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist/scripts'))
});


// HTML
gulp.task('html', function () {
    return gulp.src('app/*.html')
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

// Copy fonts 
gulp.task('copyfonts', function() {
   gulp.src('app/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/**/*.{ttf,woff,eof,svg}')
   .pipe(gulp.dest('dist/fonts/bootstrap'));
});


// Jest tests
gulp.task('jest', function () {
    var nodeModules = path.resolve('./node_modules');
    return gulp.src('app/scripts/**/__tests__')
        .pipe($.jest({
            scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
            unmockedModulePathPatterns: [nodeModules + '/react']
        }));
});


// Clean
gulp.task('clean', function (cb) {
    del(['dist/styles', 'dist/fonts', 'dist/scripts', 'dist/images'], cb);
});


// Bundle
gulp.task('bundle', ['styles', 'copyfonts', 'scripts', 'bower'], function(){
    return gulp.src('./app/*.html')
		.pipe($.useref.assets())
		.pipe($.useref.restore())
		.pipe($.useref())
		.pipe(gulp.dest('dist'));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src('app/bower_components/**/*.js', {base: 'app/bower_components'})
        .pipe(gulp.dest('dist/bower_components/'));

});

// Watch
gulp.task('watch', ['html', 'bundle', 'serve'], function () {

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
});

// Build
gulp.task('build', ['html', 'bundle', 'images']);


gulp.task('minifyjs', function() {
  gulp.src('dist/scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
});

gulp.task('deploy', function() {
	gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist',
		hostname: 'tacocat.com',
		destination: '~/themosii.com/p2',
		recursive: true,
		progress: true // the transfer progress for each file will be displayed in the console
	}));
});

// Release
gulp.task('release', ['setprod', 'build', 'minifyjs']);

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