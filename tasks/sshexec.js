/*
 * grunt-ssh
 * https://github.com/ajones/grunt-ssh
 *
 * Copyright (c) 2012 Andrew Jones
 * Licensed under the MIT license.
 */

// TODO: use passphrase
// TODO: unit tests
module.exports = function (grunt) {
  'use strict';

  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('sshexec', 'Executes a shell command on a remote machine', function () {
    var helpers = require('grunt-lib-contrib').init(grunt);
    var utillib = require('./lib/util').init(grunt);
    var Connection = require('ssh2');
    var c = new Connection();

    var done = this.async();

    var command = utillib.validateStringAndProcess('command', this.data.command);

    var options = helpers.options(this, {
      host: false,
      username: false,
      password: false,
      port: utillib.port,
      minimatch: {}
    });

    grunt.verbose.writeflags(options, 'Options');

    c.on('connect', function () {
      grunt.verbose.writeln('Connection :: connect');
    });
    c.on('ready', function () {
      grunt.verbose.writeln('Connection :: ready');
      c.exec(command, function (err, stream) {
        if (err) {
          throw err;
        }
        stream.on('data', function (data, extended) {
          var out = String(data);
          if (extended === 'stderr') {
            grunt.log.warn(out);
          } else {
            grunt.log.write(out);
          }
        });
        stream.on('end', function () {
          grunt.verbose.writeln('Stream :: EOF');
        });
        stream.on('close', function () {
          grunt.verbose.writeln('Stream :: close');
        });
        stream.on('exit', function (code, signal) {
          grunt.verbose.writeln('Stream :: exit :: code: ' + code + ', signal: ' + signal);
          c.end();
        });
      });
    });
    c.on('error', function (err) {
      grunt.verbose.writeln('Connection :: error :: ' + err);
    });
    c.on('end', function () {
      grunt.verbose.writeln('Connection :: end');
    });
    c.on('close', function (had_error) {
      grunt.verbose.writeln('Connection :: close');
      grunt.verbose.writeln('finishing task');
      done();
    });
    c.connect({
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password
    });
  });
};