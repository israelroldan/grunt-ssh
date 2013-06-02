/*
 * grunt-ssh
 * https://github.com/ajones/grunt-ssh
 *
 * Copyright (c) 2013 Andrew Jones
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

    var commands = utillib.validateStringArrayAndProcess('command', this.data.command);

    var options = this.options({
      config: false,
      host: false,
      username: false,
      password: false,
      port: utillib.port,
      ignoreErrors: false,
      minimatch: {}
    });

    var rawOptions = this.options();
    grunt.verbose.writeflags(rawOptions, 'Raw Options');

    var config;
    if ((!options.config) && (config = grunt.option('config'))) {
      options.config = config;
    }

    if (options.config && grunt.util._(options.config).isString()) {
      this.requiresConfig(['sshconfig', options.config]);
      var configOptions = grunt.config.get(['sshconfig', options.config]);
      options = grunt.util._.extend(configOptions, rawOptions);
    }

    grunt.verbose.writeflags(options, 'Options');

    c.on('connect', function () {
      grunt.verbose.writeln('Connection :: connect');
    });
    c.on('ready', function () {
      grunt.verbose.writeln('Connection :: ready');
      execCommand();
    });
    c.on('error', function (err) {
      grunt.fail.warn('Connection :: error :: ' + err);
    });
    c.on('end', function () {
      grunt.verbose.writeln('Connection :: end');
    });
    c.on('close', function (had_error) {
      grunt.verbose.writeln('Connection :: close');
      grunt.verbose.writeln('finishing task');
      done();
    });

    function execCommand() {
      if (commands.length === 0) {
        c.end();
      } else {
        var command = commands.shift();
        grunt.verbose.writeln('Executing :: ' + command);
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
            if (!options.ignoreErrors && code !== 0) {
              grunt.fail.warn('Error executing task ' + command);
              c.end();
            } else {
              execCommand();
            }
          });
        });
      }
    }

    var connectionOptions = {
      host: options.host,
      port: options.port,
      username: options.username
    };

    if (options.privateKey) {
      connectionOptions.privateKey = options.privateKey;
      connectionOptions.passphrase = options.passphrase;
    }
    else {
      connectionOptions.password = options.password;
    }

    c.connect(connectionOptions);
  });
};