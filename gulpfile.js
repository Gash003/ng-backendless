'use strict';
var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');
var browserSync = require('browser-sync').create();
var config = require('./gulp.config')();

//Mocks part based on babelify
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

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

gulp.task('build-mocks', ['clean-build-mocks'], function() {
  //We don't build mocks
  if(!config.isMocked) {
    return;
  }

  var bundler = watchify(
    browserify(config.mock, { debug: true }).transform(babelify, {presets: ['es2015']})
  );

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('mocks.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(config.dist))
      .pipe(browserSync.stream());
  }

  bundler.on('log', log);

  bundler.on('update', function() {
    log('-> babelify bundling...');
    rebundle();
  });

  return rebundle();
});

gulp.task('clean-build-mocks', function(done) {
  var files = [
    config.dist + 'mocks.js',
    config.dist + 'mocks.js.map'
  ];
  clean(files, done);
});


gulp.task('wiredep', ['clean-wiredep', 'styles', 'build-mocks'], function() {
  var bowerFiles = require('main-bower-files');
  var options = config.getBowerDefaultOptions();

  return gulp
    .src(config.index)
    .pipe($.inject(gulp.src(bowerFiles(options), {read: false}), {name: 'bower'}))
    .pipe($.inject(gulp.src(config.appJs, {
      read: false
    }), {ignorePath: 'app', addRootSlash: false}))
    .pipe($.if(config.isMocked, $.inject(gulp.src(config.dist + 'mocks.js', {
      read: false
    }), {ignorePath: 'dist', addRootSlash: false, name: 'mocks'})))
    .pipe($.inject(gulp.src(config.css, {
      read: false
    }), {ignorePath: 'dist', addRootSlash: false}))
    .pipe(gulp.dest(config.dist));
});

gulp.task('clean-wiredep', function(done) {
  var files = [config.dist + 'index.html'];
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
  return runBabelify();
});

gulp.task('clean-babelify', function(done) {
  var files = [
    config.dist + '**/*.js',
    config.dist + '**/*.js.map',
    '!' + config.dist + 'mocks.js',
    '!' + config.dist + 'mocks.js.map'
  ];
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
  gulp.watch([config.appJs], function() {
    runBabelify();
  });
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

function runBabelify() {
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
}
