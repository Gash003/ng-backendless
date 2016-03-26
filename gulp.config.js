'use strict';

module.exports = function () {
  var config = {
    temp: './temp/',
    appJs: [
      './app/**/*.js',
      './*.js',
      '!./app/bower_components/**/*'
    ],
    less: [
      './app/styles/styles.less'
    ]
  };

  return config;
};
