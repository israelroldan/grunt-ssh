module.exports = function (grunt) {
  'use strict';

  var secret = {};
  try {
    secret = grunt.file.readJSON('secret.json');
  } catch (err) {}

  // Project configuration.
  grunt.initConfig({
    // secret.json contains the host, username and password for a server to
    // run the tests on.
    secret: secret,
    test: {
      files: ['test/**/*.js']
    },
    nodeunit: {
      files: ['test/**/*.js']
    },
    beautify: {
      files: '<%= jshint.files %>'
    },
    watch: {
      files: '<%= jshint.files %>',
      tasks: 'default'
    },
    bump: {
      options: {
        pushTo: 'origin'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        globals: {
          exports: true
        }
      },
      files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    sftp: {
      test: {
        files: {
          "./": "tasks/**/*.js"
        },
        options: {
          path: '/tmp',
          host: '<%= secret.host %>',
          username: '<%= secret.username %>',
          // password auth
          password: '<%= secret.password %>'
          // private key auth
/*
          privateKey: grunt.file.read('id_rsa'),
          passphrase: '<%= secret.passphrase %>',
          */
          // create directories
/*
          path: "/tmp/does/not/exist/",
          createDirectories: true
          */
        }
      }
    },
    sshexec: {
      test: {
        // single command
        // command: 'uptime',
        // multiple commands
        command: ['uptime', 'ls', 'uptime'],
        options: {
          host: secret.host,
          username: secret.username,
          // private key auth
          //privateKey: grunt.file.read(secret.privateKeyPath),
          passphrase: secret.passphrase
        }
      }
    }
  });

  // Actually load this plugin's tasks
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-beautify');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-npm');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit']);

  grunt.registerTask('tidy', ['beautify']);

};