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
    var utillib = require('./lib/util').init(grunt);
    var Connection = require('ssh2');
    var c = new Connection();

    var done = this.async();

    // validate data options
    var data = this.data;
    data.command = utillib.validateStringAndProcess('command', data.command);
    data.host = utillib.validateStringAndProcess('host', data.host);
    data.username = utillib.validateStringAndProcess('username', data.username);
    data.port |= utillib.port;
    data.port = utillib.validateNumber('port', data.port);

    // optional password
    if (data.password) {
      if (grunt.util._.isFunction(data.password)) {
        data.password = data.password(grunt);
      }
      if (!grunt.util._(data.password).isString()) {
        grunt.warn('The password property must be a string.');
        return false;
      }
      data.password = grunt.template.process(data.password);
    }

    c.on('connect', function () {
      grunt.verbose.writeln('Connection :: connect');
    });
    c.on('ready', function () {
      grunt.verbose.writeln('Connection :: ready');
      c.exec(data.command, function (err, stream) {
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
      host: data.host,
      port: data.port,
      username: data.username,
      password: data.password
    });
  });
};