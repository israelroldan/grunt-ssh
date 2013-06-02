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
var util = require('../tasks/lib/util.js').init(grunt);

module.exports = {
  setUp: function (callback) {
    'use strict';
    this.origData = grunt.config.data;
    grunt.config.data = {
      testvalue: "test"
    };
    callback();
  },
  tearDown: function (callback) {
    'use strict';
    grunt.config.data = this.origData;
    callback();
  },
  validateString: function (test) {
    'use strict';

    test.ok(!util.validateString("name"), "should not validate invalid string");
    test.ok(!util.validateString("name", false), "should not validate invalid string");
    test.ok(!util.validateString("name", 32), "should not validate invalid string");
    test.equal(util.validateString("name", "string"), "string", "should validate a valid string");
    test.equal(util.validateString("name", function () {
      return "hello";
    }), "hello", "should evaluate a function");
    test.ok(!util.validateString("name", function () {
      return 32;
    }), "should evaluate a function");
    test.done();
  },
  validateStringAndProcess: function (test) {
    'use strict';
    test.equal(util.validateStringAndProcess("name", "string"), "string", "simple string");
    // make sure grunt has the correct data set
    test.equal(util.validateStringAndProcess("name", "string <%= testvalue %>"), "string test", "string with template");
    test.done();
  },
  validateStringArrayAndProcess: function (test) {
    'use strict';
    test.ok(!util.validateStringArrayAndProcess("name", false), "should not validate invalid string array");
    test.deepEqual(util.validateStringArrayAndProcess("name", "string"), ["string"], "should convert single string into string array");
    test.deepEqual(util.validateStringArrayAndProcess("name", function () {
      return "string";
    }), ["string"], "should evaluate function");
    test.deepEqual(util.validateStringArrayAndProcess("name", ["string 1", "string 2"]), ["string 1", "string 2"], "simple string array");
    test.deepEqual(util.validateStringArrayAndProcess("name", function () {
      return ["string 1", "string 2"];
    }), ["string 1", "string 2"], "should evaluate function");
    test.ok(!util.validateStringArrayAndProcess("name", function () {}), "should evaluate function");
    test.deepEqual(util.validateStringArrayAndProcess("name", ["string 1 <%= testvalue %>", "string 2 <%= testvalue %>"]), ["string 1 test", "string 2 test"], "strings with templates");
    test.done();
  },
  validateNumber: function (test) {
    'use strict';
    test.ok(!util.validateNumber("name"), "should not validate invalid number");
    test.equal(util.validateNumber("name", 32), 32, "should validate number");
    test.equal(util.validateNumber("name", 0), 0, "should validate zero");
    test.done();
  }

};