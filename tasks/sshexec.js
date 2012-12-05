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

  grunt.registerMultiTask('sshexec', 'Executes a shell command on a remote machine', function () {

    var Connection = require('ssh2');
    var c = new Connection();

    var done = this.async();

    // validate data options
    var data = this.data;

    // ensure we have a command
    if (!data.command) {
      grunt.warn('Missing command property.');
      return false;
    }
    if (grunt.util._.isFunction(data.command)) {
      data.command = (grunt);
    }
    if (!grunt.util._(data.command).isString()) {
      grunt.warn('The command property must be a string.');
      return false;
    }

    // ensure we have a host
    if (!data.host) {
      grunt.warn('Missing host property.');
      return false;
    }
    if (grunt.util._.isFunction(data.host)) {
      data.host = data.host(grunt);
    }
    if (!grunt.util._(data.host).isString()) {
      grunt.warn('The host property must be a string.');
      return false;
    }
    data.host = grunt.template.process(data.host);

    // ensure we have a username
    if (!data.username) {
      grunt.warn('Missing username property.');
      return false;
    }
    if (grunt.util._.isFunction(data.username)) {
      data.username = data.username(grunt);
    }
    if (!grunt.util._(data.username).isString()) {
      grunt.warn('The host property must be a string.');
      return false;
    }
    data.username = grunt.template.process(data.username);

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
      port: 22,
      username: data.username,
      password: data.password
    });
  });
};