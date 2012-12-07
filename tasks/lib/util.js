/*
 * grunt-ssh
 * https://github.com/ajones/grunt-ssh
 *
 * Copyright (c) 2012 Andrew Jones
 * Licensed under the MIT license.
 */
exports.init = function (grunt) {
  'use strict';

  var exports = {};

  // Return gzipped source.
  exports.validateString = function (name, string) {
    if (!string) {
      grunt.warn('Missing ' + name + ' property.');
      return false;
    }
    if (grunt.util._.isFunction(string)) {
      string = string(grunt);
    }
    if (!grunt.util._(string).isString()) {
      grunt.warn('The command property must be a string.');
      return false;
    }
    return string;
  };

  exports.validateStringAndProcess = function (name, string) {
    return grunt.template.process(exports.validateString(name, string));
  }

  return exports;
};