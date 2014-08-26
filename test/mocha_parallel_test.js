'use strict';

var grunt = require('grunt');

exports.mocha_parallel = {
  setUp: function(done) {
    done();
  },
  todo: function(test) {
    // TODO: write some tests...
    test.equal(true, true);
    test.done();
  },
};
