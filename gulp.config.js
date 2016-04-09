'use strict';

module.exports = function () {
  var client = './app/';
  var dist = './dist/';

  var config = {
    dist: dist,
    client: client,
    bower: {
      bowerJson: './bower.json',
      directory: './bower_components/',
      ignorePath: '..'
    },
    css: [
      dist + 'styles/*.css'
    ],
    allJs: [
      client + '**/*.js',
      './*.js'
    ],
    appJs: [
      client + '**/*.js'
    ],
    html: [
      client + '**/*.html', 
      '!' + client + 'index.html'
    ],
    index: client + 'index.html',
    less: [
      client + 'styles/*.less'
    ]
  };

  config.getWiredepDefaultOptions = function() {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };

    return options;
  };

  return config;
};
