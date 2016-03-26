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
    .src(config.appJs)
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

//------
function clean(path, done) {
  del(path).then(function () { done(); });
}
