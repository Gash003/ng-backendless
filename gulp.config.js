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
      client + '**/*.js',
      '!' + client + 'mocks.js',
      '!' + client + '**/mocks.js'
    ],
    html: [
      client + '**/*.html', 
      '!' + client + 'index.html'
    ],
    index: client + 'index.html',
    mock: client + 'mocks.js',
    less: [
      client + 'styles/*.less'
    ]
  };

  config.getBowerDefaultOptions = function(isMocked) {
    var options = {
      paths: {
        bowerDirectory: config.bower.directory,
        bowerJson: config.bower.json
      },
      includeDev: config.isMocked
    };

    return options;
  };

  return config;
};
