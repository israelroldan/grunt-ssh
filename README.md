# grunt-ssh

[![Build Status](https://travis-ci.org/andrewrjones/grunt-ssh.png?branch=master)](https://travis-ci.org/andrewrjones/grunt-ssh)
[![NPM version](https://badge.fury.io/js/grunt-ssh.png)](http://badge.fury.io/js/grunt-ssh)
![Dependencies](https://david-dm.org/andrewrjones/grunt-ssh.png)

> SSH and SFTP tasks for Grunt, using [a pure JS implementation of ssh2](https://github.com/mscdex/ssh2).

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

## Synopsis

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
      password: '<%= secret.password %>',
      showProgress: true
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

The path on the remote server. Defaults to `/`.

###### minimatch ```object```

Options for [minimatch](https://github.com/isaacs/minimatch).

###### username ```string```

The username to authenticate as on remote system.

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

###### showProgress ```boolean```

Show a progress bar during the file transfer.  The default is ```false```.

###### chunkSize ```integer```

Size of each read in bytes (default: 32768)

###### callback ```function```

Callback function called after command execution. Default: ```empty function```

##### Connection options

There are three mutually exclusive sets of connection options. They are
`privateKey` (with optional `passphrase`), `password`, and `agent`. If any of
these options are private, they will be tried exclusively, and other connection
options will be ignored. Each is described a bit more below.

###### privateKey ```string```

A string containing the contents of the private key to use to authenticate with the remote system, you can load this from a file using ```grunt.file.read```. Be careful you don't put this into source control unless you mean it!

If a privateKey and passphrase are required, they 

```js
options: {
  privateKey: grunt.file.read("id_rsa"),
  passphrase: <%= secret.passphrase %>
}
```

###### passphrase ```string```

The passphrase to use with the ```privateKey```. As per the ```privateKey```, do not expose this in your Gruntfile or anywhere that'll end up public unless you mean it, load it from an external file.

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
If you use ```jshint```, remember to add ```process: true``` in ```globals``` 

###### readyTimeout ```integer```

How often (in milliseconds) to wait for the SSH handshake to complete.

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


###### host ```string```

The remote host to copy to, set up in your `~/.ssh/config`.

###### port ```number```

The remote port, optional, defaults to `22`.

###### pty ```boolean/object```

Set to true to allocate a pseudo-tty with defaults, or an object containing specific pseudo-tty settings (see '[Pseudo-TTY settings](https://github.com/mscdex/ssh2#pseudo-tty-settings)'). Setting up a pseudo-tty can be useful when working with remote processes that expect input from an actual terminal (e.g. sudo's password prompt).

###### ignoreErrors ```boolean```

Determins if the task should stop or continue if any of the commands returns a code other than 0. Disabled by default.

###### suppressRemoteErrors ```boolean```

If true only display remote error messages if Grunt is run with the --verbose flag.

##### Connection options

There are three mutually exclusive sets of connection options. They are
`privateKey` (with optional `passphrase`), `password`, and `agent`. If any of
these options are private, they will be tried exclusively, and other connection
options will be ignored. Each is described a bit more below.

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

If you use ```jshint```, remember to add ```process: true``` in ```globals``` 

###### readyTimeout ```integer```

How often (in milliseconds) to wait for the SSH handshake to complete.

## Note

sshexec runs each command individually, and it does not keep state of the previous command, so when you need to perform 2 commands or more , you could do e.g.:

```js
sshexec: {
  test: {
    command: ['sh -c "cd /; ls; pwd"'],
    options: {
      host: '<%= secret.host %>',
      username: '<%= secret.username %>',
      password: '<%= secret.password %>'
    }
  }
}
```


## Links

* [Grunt your deployments too - toptable Tech Blog](http://tech.toptable.co.uk/blog/2013/08/08/grunt-your-deployments-too/)
* [Grunt Deployment over SSH with Git - Justin Klemm](http://justinklemm.com/grunt-js-deployment-ssh-git/)

## Release History
* 2015/02/07 - v0.12.1 - [#92](https://github.com/chuckmo/grunt-ssh/pull/92) Fixed ssh2 dependency to version 0.3.x ([bostrom (Fredrik Boström)](https://github.com/bostrom))
* 2014/09/11 - v0.12.0 - [#70:](https://github.com/andrewrjones/grunt-ssh/pull/70) Ensure empty directories are created ([Robert Price](https://github.com/robertprice)); [#71:](https://github.com/andrewrjones/grunt-ssh/pull/72) Enables forwarding of the authentication agent connection ([Yannis Sgarra](https://github.com/yannissgarra)); [#73:](https://github.com/andrewrjones/grunt-ssh/pull/73) Downloading files ([sheo13666](https://github.com/sheo13666)); [#75:](https://github.com/andrewrjones/grunt-ssh/pull/75) Doc fix ([Alexander Afanasiev](https://github.com/alecxe)).
* 2014/06/04 - v0.11.2 - [#63:](https://github.com/andrewrjones/grunt-ssh/pull/63) `sftp` improvements [(Brian White](https://github.com/mscdex); [#64:](https://github.com/andrewrjones/grunt-ssh/pull/64) Changed error handling for SFTP [junglebarry](https://github.com/junglebarry)
* 2014/03/21 - v0.11.1 - [#59:](https://github.com/andrewrjones/grunt-ssh/pull/59) Don't add '/' to empty path ([David J. Bradshaw](https://github.com/davidjbradshaw)).
* 2014/03/15 - v0.11.0 - [#50:](https://github.com/andrewrjones/grunt-ssh/pull/50) Enable setting of `chunkSize` option ([Michael Lam](https://github.com/mlamz)); [#51:](https://github.com/andrewrjones/grunt-ssh/pull/51) Fix bad output on close ([Eric Kever](https://github.com/pinktrink)); [#56:](https://github.com/andrewrjones/grunt-ssh/pull/56) Add readyTimeout option for ssh2 connections ([calebTomlinson](https://github.com/calebTomlinson)).
* 2014/01/16 - v0.10.0 - [#47:](https://github.com/andrewrjones/grunt-ssh/pull/47) Add an optional progress bar for sftp uploads ([Jason Williams](https://github.com/jaswilli)).
* 2013/12/06 - v0.9.1 - [#44:](https://github.com/andrewrjones/grunt-ssh/issues/44) Improve doc for SSH connection options ([Mark Stosberg](https://github.com/markstos)); [#45:](https://github.com/andrewrjones/grunt-ssh/issues/45) Fix incorrect Connection parameter in `execCommand` ([jabes](https://github.com/jabes)).
* 2013/12/06 - v0.9.0 - [#28:](https://github.com/andrewrjones/grunt-ssh/issues/28) Pseudo-TTY support; [#40:](https://github.com/andrewrjones/grunt-ssh/issues/40) Add trailing slash to path if needed; [#31:](https://github.com/andrewrjones/grunt-ssh/issues/31) Print debug messages from ssh2 when `--debug` option is passed; Use latest version of ssh2 (0.2.14).
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
