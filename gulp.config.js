'use strict';

module.exports = function () {
  var client = './app/';
  var temp = './temp/';

  var config = {
    temp: temp,
    client: client,
    bower: {
      bowerJson: './bower.json',
      directory: './bower_components/',
      ignorePath: '..'
    },
    css: [
      temp + 'styles.css'
    ],
    allJs: [
      client + '**/*.js',
      './*.js'
    ],
    appJs: [
      client + '**/*.js'
    ],
    index: client + 'index.html',
    less: [
      client + 'styles/styles.less'
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
