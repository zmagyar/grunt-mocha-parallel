module.exports = function(suite) {
  require('mocha').interfaces.bdd(suite);

  /**
   * Override describe to include only skipped tests
   */
  suite.on('pre-require', function(context, file, mocha) {
    var describe = context.describe;

    context.describe = context.context = function(title, fn) {
    }
    context.describe.skip = function(title, fn) {
      return describe.skip(title, fn);
    };
    context.describe.only = function(title, fn) {
    }
  });
};
