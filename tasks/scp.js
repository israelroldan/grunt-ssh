/*
 * grunt-ssh
 * https://github.com/ajones/grunt-ssh
 *
 * Copyright (c) 2012 Andrew Jones
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';

  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('scp', 'Copy files to a (remote) machine running an SSH daemon.', function () {

    var options = helpers.options(this, {
      data: {}
    });

    grunt.verbose.writeflags(options, 'Options');
  });
};