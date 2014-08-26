module.exports = function(suite) {
  var mocha = require('mocha');
  mocha.interfaces.bdd(suite);

  suite.on('pre-require', function(context, file, mocha) {
    /**
     * Override describe to filter on specified test name.
     */
    context.describe = context.context = function(title, fn) {
      console.error(title);
    }
    context.describe.skip = function(title, fn) {
      return describe.skip(title, fn);
    };
    context.describe.only = function(title, fn) {
      return describe.only(title, fn);
    }
  });
};
