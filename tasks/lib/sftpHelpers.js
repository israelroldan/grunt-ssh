/*
 * grunt-ssh
 * https://github.com/andrewrjones/grunt-ssh
 *
 * Copyright (c) 2013 Andrew Jones
 * Licensed under the MIT license.
 */
exports.init = function (grunt) {
  'use strict';
  var exports = {};
  exports.sftpRecursiveMkDir = function (c, path, attributes, finalCallback) {
    var pathParts = path.split("/").filter(function (part) {
      return part !== "";
    });
    var currentPath = "/";
    var ptr = 0;

    var mkdir = function (path, callback) {
      c.stat(currentPath, function (error, stat) {
        if (error) {
          grunt.verbose.writeln("Creating " + currentPath);
          c.mkdir(currentPath, attributes, function (error) {
            if (error) {
              finalCallback(false, "Failed to create " + path + " " + error);
            }
            else {
              callback(true);
            }
          });
        } else {
          callback(true);
        }
      });
    };

    var mkdirCallback = function () {
      if (ptr === pathParts.length) {
        finalCallback(true);
        return;
      }
      currentPath += (ptr > 0 ? "/" : "") + pathParts[ptr];
      ptr++;
      mkdir(currentPath, mkdirCallback);
    };

    mkdir(currentPath, mkdirCallback);
  };

  exports.sftpCD = function (c, path, attributes, createIfRequired, callback) {
    grunt.verbose.writeln("cd to " + path);
    c.opendir(path, function (error, handle) {
      if (error && createIfRequired) {
        grunt.verbose.writeln(path + " does not exist, creating.");
        exports.sftpRecursiveMkDir(c, path, attributes, callback);
      }
      else if (error) {
        callback(false);
      }
      else {
        callback(true);
      }
    });
  };

  return exports;
};
