'use strict';
var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync').create();
var config = require('./gulp.config')();

var $ = require('gulp-load-plugins')({
  camelize: true,
  lazy: true
});

gulp.task('vet', function () {
  return gulp
    .src(config.allJs)
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jscsStylish.combineWithHintResults())
    .pipe($.jshint.reporter('jshint-stylish', { verbose: true }));
});

gulp.task('styles', ['clean-styles'], function () {
  return gulp
    .src(config.less, {base: config.client})
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('clean-styles', function (done) {
  var files = config.dist + '**/*.css';
  clean(files, done);
});

gulp.task('wiredep', ['clean-wiredep', 'styles'], function() {
  var wiredep = require('wiredep').stream;
  var options = config.getWiredepDefaultOptions();

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(config.appJs, {
      read: false
    }), {ignorePath: 'app', addRootSlash: false}))
    .pipe($.inject(gulp.src(config.css, {
      read: false
    }), {ignorePath: 'dist', addRootSlash: false}))
    .pipe(gulp.dest(config.dist));
});

gulp.task('clean-wiredep', function(done) {
  var files = config.dist + 'index.html';
  clean(files, done);
});


gulp.task('templates', ['clean-templates'], function() {
  return gulp
    .src(config.html, {base: config.client})
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.stream());
});

gulp.task('clean-templates', function(done) {
  var files = [
    config.dist + '**/*.html',
    '!' + config.dist + 'index.html'
  ];
  clean(files, done);
});

gulp.task('babelify', ['clean-babelify'], function() {
  return gulp
    .src(config.appJs)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.dist));
});

gulp.task('clean-babelify', function(done) {
  var files = config.dist + '**/*.js';
  clean(files, done);
});

gulp.task('browsersync', function() {
  browserSync.init({
    server: {
      baseDir: config.dist,
      routes: {
        "/bower_components": "bower_components"
      }
    }
  });

  gulp.watch([config.less], ['styles']);
  gulp.watch([config.html], ['templates']);
});

gulp.task('build', ['wiredep', 'templates', 'babelify'], function() {
  browserSync.init({
    server: {
      baseDir: config.dist,
      routes: {
        "/bower_components": "bower_components"
      }
    }
  });
});

function clean(path, done) {
  del(path).then(function () { done(); });
}
