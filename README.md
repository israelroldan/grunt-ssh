***Work in progress***

# grunt-ssh

SSH tasks for Grunt.

### Overview

Inside your `grunt.js` file add a section named `scp`.

#### Parameters

##### files ```object```

This defines what files this task will process and should contain key:value pairs.

##### options ```object```

This controls how this task (and its helpers) operate and should contain key:value pairs, see options below.

#### Options

##### user ```string```

The username to authenticate as on remote system.

##### host ```string```

The remote host to copy to, set up in your `~/.ssh/config`.

##### port ```number```

The remote port, optional, defaults to `22`.

#### Config Examples

``` javascript
scp: {
  deploy: {
    options: {
      user: 'bob',
      host: 'google.com',
      port: 500
    },
    files: {}
  }
}
```

### Release History
_(Nothing yet)_

### License
Copyright (c) 2013 Andrew Jones
Licensed under the MIT license.
