module.exports = function(suite) {
  require('mocha').interfaces.bdd(suite);

  /**
   * Override describe to filter on specified suite name.
   */
  suite.on('pre-require', function(context, file, mocha) {
    var describe = context.describe;
    var inMatchingTestSuite = false;

    context.describe = context.context = function(title, fn) {
      if (title == process.env.MOCHA_PARALLEL_SUITE || inMatchingTestSuite) {
        inMatchingTestSuite = true;
        describe(title, fn);
        inMatchingTestSuite = false;
      }
    }
    context.describe.skip = function(title, fn) {
      return describe.skip(title, fn);
    };
    context.describe.only = function(title, fn) {
      return describe.only(title, fn);
    }
  });
};
