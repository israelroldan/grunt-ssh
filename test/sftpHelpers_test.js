/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var sinon = require('sinon');
var grunt = require('grunt');
var helper = require('../tasks/lib/sftpHelpers.js').init(sinon.stub(grunt));

var conn, mock;

module.exports = {
  setUp: function (callback) {
    'use strict';
    conn = {
      opendir: function () {},
      stat: function () {},
      mkdir: function () {}
    };

    mock = sinon.mock(conn);
    callback();
  },
  "existing directories": function (test) {
    'use strict';
    mock.expects("stat").withArgs("/").callsArgWith(1, null, null);
    mock.expects("stat").withArgs("/foo").callsArgWith(1, null, null);
    mock.expects("stat").withArgs("/foo/bar").callsArgWith(1, null, null);
    mock.expects("stat").withArgs("/foo/bar/baz").callsArgWith(1, null, null);

    var finalCallback = sinon.spy();
    helper.sftpRecursiveMkDir(conn, "/foo/bar/baz", {}, finalCallback);
    test.ok(finalCallback.called, "Expected final callback");
    mock.verify();
    test.done();
  },
  "create directories": function (test) {
    'use strict';
    mock.expects("stat").withArgs("/").callsArgWith(1, false, null);
    mock.expects("stat").withArgs("/foo").callsArgWith(1, {}, null);
    mock.expects("stat").withArgs("/foo/bar").callsArgWith(1, {}, null);
    mock.expects("stat").withArgs("/foo/bar/baz").callsArgWith(1, {}, null);

    mock.expects("mkdir").withArgs("/foo").callsArg(2);
    mock.expects("mkdir").withArgs("/foo/bar").callsArg(2);
    mock.expects("mkdir").withArgs("/foo/bar/baz").callsArg(2);

    var finalCallback = sinon.spy();
    helper.sftpRecursiveMkDir(conn, "/foo/bar/baz", {}, finalCallback);
    test.ok(finalCallback.withArgs(true).calledOnce, "Expected final callback");
    mock.verify();
    test.done();
  },
  "cd to existing directory": function (test) {
    'use strict';
    mock.expects("opendir").withArgs("/foo/bar/baz").callsArgWith(1, {}, null);
    var finalCallback = sinon.spy();
    helper.sftpCD(conn, "/foo/bar/baz", {}, false, finalCallback);
    test.ok(finalCallback.called, "Expected final callback");
    mock.verify();
    test.done();
  },
  "cd to directory does not exist and not requested": function (test) {
    'use strict';
    mock.expects("opendir").withArgs("/foo/bar/baz").callsArgWith(1, {}, null);
    var finalCallback = sinon.spy();
    helper.sftpCD(conn, "/foo/bar/baz", {}, false, finalCallback);

    test.ok(finalCallback.withArgs(false).calledOnce, "Expected final callback");
    mock.verify();
    test.done();
  },
  "creation fails": function (test) {
    'use strict';
    mock.expects("stat").withArgs("/").callsArgWith(1, false, null);
    mock.expects("stat").withArgs("/foo").callsArgWith(1, {}, null);
    mock.expects("stat").withArgs("/foo/bar").callsArgWith(1, {}, null);

    mock.expects("mkdir").withArgs("/foo").callsArg(2);
    mock.expects("mkdir").withArgs("/foo/bar").callsArgWith(2, {});

    var finalCallback = sinon.spy();
    helper.sftpRecursiveMkDir(conn, "/foo/bar/baz", {}, finalCallback);
    test.ok(finalCallback.withArgs(false).calledOnce, "Expected final callback");
    mock.verify();
    test.done();
  }
};