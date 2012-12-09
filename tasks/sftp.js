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
    var utillib = require('./lib/util').init(grunt);
    var fs = require('fs');
    var Connection = require('ssh2');

    // validate data options
    var data = this.data;
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

    var c = new Connection();
    var done = this.async();

    c.on('connect', function () {
      grunt.verbose.writeln('Connection :: connect');
    });
    c.on('ready', function () {
      grunt.verbose.writeln('Connection :: ready');
      c.sftp(function (err, sftp) {
        if (err) {
          throw err;
        }
        sftp.on('end', function () {
          grunt.verbose.writeln('SFTP :: SFTP session closed');
        });
        sftp.on('close', function () {
          grunt.verbose.writeln('SFTP :: close');
          // sftp.end();
        });

        // TODO: get files from options
        // work with multiple files
        var from = fs.createReadStream('grunt.js');
        var to = sftp.createWriteStream('grunt.js');

        to.on('close', function () {
          sftp.end();
          c.end();
        });

        // do copy
        from.pipe(to);
      });
    });
    c.on('error', function (err) {
      grunt.warn('Connection :: error :: ' + err);
    });
    c.on('end', function () {
      grunt.verbose.writeln('Connection :: end');
    });
    c.on('close', function (had_error) {
      grunt.verbose.writeln('Connection :: close');
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