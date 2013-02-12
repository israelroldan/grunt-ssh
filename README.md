# grunt-ssh

SSH tasks for Grunt.

## Overview

This library provides two Grunt tasks for ssh:

* _sftp_
* _sshexec_

## Synopsys

```js
// don't keep passwords in source control
secret: '<json:secret.json>',
sftp: {
  test: {
    files: {
      "./": "*json"
    },
    options: {
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

## Description

### sftp

Copies one or more files to a remote server over ssh.

Inside your `grunt.js` file add a section named `sftp`.

#### Parameters

##### files ```object```

The files to copy. Should contain key:value pairs.

##### options ```object```

###### username ```string```

The username to authenticate as on remote system.

###### password ```string```

The password to authenticate on remote system.

###### host ```string```

The remote host to copy to, set up in your `~/.ssh/config`.

###### port ```number```

The remote port, optional, defaults to `22`.

### sshexec

Runs a command over ssh.

Inside your `grunt.js` file add a section named `sshexec`.

#### Parameters

##### command ```string```

The command to run.

##### options ```object```

###### username ```string```

The username to authenticate as on remote system.

###### password ```string```

The password to authenticate on remote system.

###### host ```string```

The remote host to copy to, set up in your `~/.ssh/config`.

###### port ```number```

The remote port, optional, defaults to `22`.

### Release History
_(Nothing yet)_

### License
Copyright (c) 2013 Andrew Jones
Licensed under the MIT license.
