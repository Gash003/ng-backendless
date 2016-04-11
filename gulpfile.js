'use strict';
var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');
var browserSync = require('browser-sync').create();
var config = require('./gulp.config')();

var $ = require('gulp-load-plugins')({
  camelize: true,
  lazy: true
});

config.isMocked = args.mocked;

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
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.stream());
});

gulp.task('clean-styles', function (done) {
  var files = config.dist + '**/*.css';
  clean(files, done);
});

gulp.task('wiredep', ['clean-wiredep', 'styles'], function() {
  var bowerFiles = require('main-bower-files');
  var options = config.getBowerDefaultOptions();

  return gulp
    .src(config.index)
    .pipe($.inject(gulp.src(bowerFiles(options), {read: false}), {name: 'bower'}))
    .pipe($.inject(gulp.src(config.appJs, {
      read: false
    }), {ignorePath: 'app', addRootSlash: false}))
    .pipe($.if(config.isMocked, $.inject(gulp.src(config.mock, {
      read: false
    }), {ignorePath: 'app', addRootSlash: false, name: 'mocks'})))
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

gulp.task('babelify', function() {
  return gulp
    .src(config.appJs)
    .pipe($.plumber())
    .pipe($.cached('babelizing'))
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.stream());
});

gulp.task('clean-babelify', function(done) {
  var files = ['!' + config.dist + 'mock.js', config.dist + '**/*.js'];
  clean(files, done);
});

gulp.task('browsersync', function() {

  startBrowserSync();

  gulp.watch([config.less], ['styles']);
  gulp.watch([config.html], ['templates']);
  gulp.watch([config.appJs], ['babelify']);

});

gulp.task('build', ['wiredep', 'templates', 'babelify'], function() {
  startBrowserSync();

  gulp.watch([config.less], ['styles']);
  gulp.watch([config.html], ['templates']);
  gulp.watch([config.appJs], ['babelify']);
});

function log(msg) {
  if(typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  }
  else {
    $.util.log($.util.colors.blue(msg));
  }
}

function clean(path, done) {
  del(path).then(function () { done(); });
}

function startBrowserSync() {
  if(browserSync.active) {
    return;
  }

  browserSync.init({
    server: {
      baseDir: config.dist,
      routes: {
        "/bower_components": "bower_components"
      }
    }
  });
}
