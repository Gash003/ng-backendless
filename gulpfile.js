'use strict';
var gulp = require('gulp');
var del = require('del');
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
    .src(config.less)
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
    .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function (done) {
  var files = config.temp + '**/*.css';
  clean(files, done);
});

gulp.task('less-watcher', function () {
  gulp.watch([config.less], ['styles']);
});


gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;
  var options = config.getWiredepDefaultOptions();

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(config.appJs)))
    .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
  var wiredep = require('wiredep').stream;
  var options = config.getWiredepDefaultOptions();

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(config.css)))
    .pipe(gulp.dest(config.client));
});

//------
function clean(path, done) {
  del(path).then(function () { done(); });
}
