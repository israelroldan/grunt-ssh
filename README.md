# grunt-ssh

[![Build Status](https://travis-ci.org/andrewrjones/grunt-ssh.png?branch=master)](https://travis-ci.org/andrewrjones/grunt-ssh)
[![NPM version](https://badge.fury.io/js/grunt-ssh.png)](http://badge.fury.io/js/grunt-ssh)
![Dependencies](https://david-dm.org/andrewrjones/grunt-ssh.png)

> SSH and SFTP tasks for Grunt.

## Overview

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ssh --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ssh');
```

This library provides two Grunt tasks for ssh:

* _sftp_
* _sshexec_

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.1.0](https://github.com/andrewrjones/grunt-ssh/tree/v0.1.0).*

## Synopsys

```js
// don't keep passwords in source control
secret: grunt.file.readJSON('secret.json'),
sftp: {
  test: {
    files: {
      "./": "*json"
    },
    options: {
      path: '/tmp/',
      host: '<%= secret.host %>',
      username: '<%= secret.username %>',
      password: '<%= secret.password %>'
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
```

An example `secret.json` might look like:

```js
{
    "host" : "myhost",
    "username" : "andrewrjones",
    "password" : "**************"
}
```

Or, specifying SSH configurations for re-use, and referencing from tasks:

```js
// don't keep passwords in source control
sshconfig: {
  "myhost": grunt.file.readJSON('myhost.json')
},
sshexec: {
  test: {
    command: 'uptime',
    options: {
      config: 'myhost'
    }
  },
  ls: {
    command: 'ls -la',
    options: {
      config: 'myhost'
    }
  }
}
```

You can also overwrite the `username`, `password`, `passphrase` or `config` at runtime as a command line option:

```sh
$ grunt sshexec:someTask --config myhost --username foo
```

## Description

### sftp

Copies one or more files to a remote server over ssh.

Inside your `grunt.js` file add a section named `sftp`.

#### Parameters

##### files ```object```

The files to copy. Should contain key:value pairs.

If you would like to upload multiple files, use an array. For example:

```js
files: {
  "./": ["<%= dirs.css %>style.css","<%= dirs.css %>login.css","<%= dirs.css %>print.css"]
},
```

The following will __not__ work:

```js
files: {
  "./": "<%= dirs.css %>style.css",
  "./": "<%= dirs.css %>login.css",
  "./": "<%= dirs.css %>print.css"
},
```

##### options ```object```

###### path ```string```

The path on the remote server. Defaults to home.

###### minimatch ```object```

Options for [minimatch](https://github.com/isaacs/minimatch).

###### username ```string```

The username to authenticate as on remote system.

###### password ```string```

The password to authenticate on remote system.

###### agent ```string```

Path to ssh-agent's UNIX socket for ssh-agent-based user authentication.

```js
options: {
         host: '<%= pkg.host %>',
         port: '<%= pkg.port %>',
         username: '<%= pkg.username %>',
         agent: process.env.SSH_AUTH_SOCK
}
```

If you use ```jshint```, rember to add ```process: true``` in ```globals``` 

###### privateKey ```string```

A string containing the contents of the private key to use to authenticate with the remote system, you can load this from a file using ```grunt.file.read```. Be careful you don't put this into source control unless you mean it!

```js
options: {
  privateKey: grunt.file.read("id_rsa"),
  passphrase: <%= secret.passphrase %>
}
```

###### passphrase ```string```

The passphrase to use with the ```privateKey```. As per the ```privateKey```, do not expose this in your Gruntfile or anywhere that'll end up public unless you mean it, load it from an external file.

###### host ```string```

The remote host to copy to, set up in your `~/.ssh/config`.

###### port ```number```

The remote port, optional, defaults to `22`.

###### srcBasePath ```string```

Optionally strip off an initial part of the file when performing the SFTP operation. This is a string operation, so trailing slashes are important.

For example:

```js
    /* [...] */
    files: {
      "./": "dist/**"
    },
    options: {
      path: '/tmp/',
      /* [...] */
      srcBasePath: "dist/"
```

Would SFTP the files in dist directly into tmp (eg. ```dist/index.html``` ==> ```/tmp/index.html```)

###### createDirectories ```boolean```

Optionally check whether the directories files will be sftp'd to exist first. This can take a bit of extra time as directories need to be checked, so this option is disabled by default.

See also the ```directoryPermissions``` option.

###### directoryPermissions ```number```

The permissions to apply to directories created with createDirectories.  The default is 0755.  JSHint will probably yell at you unless you set this using ```parseInt```:

```js
directoryPermissions: parseInt(755, 8)
```

### sshexec

Runs a command over ssh.

__NOTE:__ To see the output of your `sshexec` command locally, use the `--verbose` flag.

Inside your `grunt.js` file add a section named `sshexec`.

#### Parameters

##### command ```string``` or ```array```

The command or commands to run, if an array is supplied, all the commands are executed on the same connection.

##### options ```object```

###### username ```string```

The username to authenticate as on remote system.

###### password ```string```

The password to authenticate on remote system.

###### agent ```string```

Path to ssh-agent's UNIX socket for ssh-agent-based user authentication.

```js
options: {
         host: '<%= pkg.host %>',
         port: '<%= pkg.port %>',
         username: '<%= pkg.username %>',
         agent: process.env.SSH_AUTH_SOCK
}
```

If you use ```jshint```, rember to add ```process: true``` in ```globals``` 

###### privateKey ```string```

A string containing the contents of the private key to use to authenticate with the remote system, you can load this from a file using ```grunt.file.read```. Be careful you don't put this into source control unless you mean it!

```js
options: {
  privateKey: grunt.file.read("id_rsa"),
  passphrase: <%= secret.passphrase %>
}
```

###### passphrase ```string```

The passphrase to use with the ```privateKey```. As per the ```privateKey```, do not expose this in your Gruntfile or anywhere that'll end up public unless you mean it, load it from an external file.

###### host ```string```

The remote host to copy to, set up in your `~/.ssh/config`.

###### port ```number```

The remote port, optional, defaults to `22`.

###### ignoreErrors ```boolean```

Determins if the task should stop or continue if any of the commands returns a code other than 0. Disabled by default.

###### suppressRemoteErrors ```boolean```

If true only display remote error messages if Grunt is run with the --verbose flag.

## Release History
* 2013/11/17 - v0.8.0 - [#33:](https://github.com/andrewrjones/grunt-ssh/pull/33) File counter for `sftp` and `suppressRemoteErrors` option for `sshexec` ([David J. Bradshaw](https://github.com/davidjbradshaw)); [#34:](https://github.com/andrewrjones/grunt-ssh/pull/34) Use stat() instead of opendir() for checking existence of a dir ([Harri Hälikkä](https://github.com/harriha)); [#38:](https://github.com/andrewrjones/grunt-ssh/pull/34) Doc updates ([Alexandre Richonnier](https://github.com/heralight)).
* 2013/10/17 - v0.7.0 - [#32:](https://github.com/andrewrjones/grunt-ssh/pull/32) Added command line options for username, password and passphrase ([David J. Bradshaw](https://github.com/davidjbradshaw)); Doc updates.
* 2013/09/25 - v0.6.2 - Allow sftp task to use the shared sshconfig; Allow overriding sshconfig properties in the task config ([Andy Royle](https://github.com/andyroyle)). Document using the private key with `sshexec`.
* 2013/07/25 - v0.6.2 - Fix error when no passphrase is provided ([James Wyse](https://github.com/jameswyse)).
* 2013/07/21 - v0.6.1 - `trim` options that may be read from files; Allow `sshexec` to use ssh-agent-based user authentication ([Andy Shinn](https://github.com/andyshinn)).
* 2013/06/26 - v0.6.0 - Ability to supply a path to ssh-agent's UNIX socket for ssh-agent-based user authentication ([Justin Kulesza](https://github.com/kuleszaj)).
* 2013/06/25 - v0.5.1 - Fix `srcBasePath` ([owenmead](https://github.com/owenmead)).
* 2013/06/02 - v0.5.0 - Add support for multiple comands ([Andrew Stewart](https://github.com/andysprout)).
* 2013/05/11 - v0.4.0 - Support defining and referencing ssh configurations. ([Anders Johnson](http://andrz.me/)).
* 2013/05/07 - v0.3.3 - Fix encoding issues. ([John Wright](https://github.com/johngeorgewright)).
* 2013/05/07 - v0.3.2 - Fix race condition when uploading larger files. ([John Wright](https://github.com/johngeorgewright)).
* 2013/03/25 - v0.3.1 - Fix race condition when uploading multiple files. ([John Wright](https://github.com/johngeorgewright)).
* 2013/02/27 - v0.3.0 - Support private key based authentication; Allow sftp to make directories if they do not exist. ([marcins](https://github.com/marcins)).
* 2013/02/26 - v0.2.1 - Add `srcBasePath` option to `sftp` ([marcins](https://github.com/marcins)).
* 2013/02/20 - v0.2.0 - Update for grunt 0.4.x.
* 2013/02/13 - v0.1.0 - Initial release with _sshexec_ and _sftp_ tasks.

## License
Copyright (c) 2013 [Andrew Jones](http://andrew-jones.com)
Licensed under the MIT license.
