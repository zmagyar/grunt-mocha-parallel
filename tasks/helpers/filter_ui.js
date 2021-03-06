module.exports = function(suite) {
  require('mocha').interfaces.bdd(suite);

  /**
   * Override describe to filter on specified suite name.
   */
  suite.on('pre-require', function(context, file, mocha) {
    var describe = context.describe;
    var suiteDepth = 0;

    context.describe = context.context = function(title, fn) {
      if (title == process.env.MOCHA_PARALLEL_SUITE || suiteDepth) {
        suiteDepth++;
        describe(title, fn);
        suiteDepth--;
      }
    }
    context.describe.skip = function(title, fn) {
      // skipped tests are run once using the skipped ui
    };
    context.describe.only = function(title, fn) {
      return context.describe(title, fn);
    }
  });
};
