module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // secret.json contains the host, username and password for a server to
    // run the tests on.
    secret: grunt.file.readJSON('secret.json'),
    test: {
      files: ['test/**/*.js']
    },
    beautify: {
      files: '<config:jshint.files>'
    },
    watch: {
      files: '<config:jshint.files>',
      tasks: 'default'
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
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    sftp: {
      test: {
        files: {
          "./": "*json"
        },
        options: {
          host: '<%= secret.host %>',
          username: '<%= secret.username %>',
          password: '<%= secret.password %>',
          path: "/tmp/"
        }
      }
    },
    sshexec: {
      test: {
        command: 'uptime',
        options: {
          host: '<%= secret.host %>',
          username: '<%= secret.username %>',
          password: '<%= secret.password %>'
        }
      }
    }
  });

  // Actually load this plugin's tasks
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-beautify');
  grunt.loadNpmTasks('grunt-bump');

  // Default task.
  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('tidy', ['beautify']);

};
