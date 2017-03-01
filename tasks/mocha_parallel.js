module.exports = function (grunt) {
  var async = require('async');
  var child_process = require('child_process');
  var os = require('os');
  var path = require('path');

  /**
   * Enumerate and return the top-level suite names.
   */
  function getTopLevelSuiteNames(options, callback) {
    var mocha = options.mocha;
    var enumerate_ui = path.resolve(__dirname, 'helpers', 'enumerate_ui.js');
    var command = mocha + ' -u ' + enumerate_ui + ' ' + (options.args() || []).join(' ');

    var enumerate = child_process.exec(command, function (code, stdout, stderr) {
      var names = stderr.replace(/^\s+|\s+$/g, '').split('\n');
      callback(names);
    });
  }

  /**
   * Helper method for building mocha args lists
   */
  function addInternalArgs(args, ui) {
    if (args.indexOf('-u') >= 0 || args.indexOf('--ui') >= 0) {
      throw new Error('UI plugins are not supported by grunt-mocha-parallel');
    }
    var cleanup = path.resolve(__dirname, 'helpers', 'cleanup.js');
    return ['--ui', ui, '--require', cleanup].concat(args);
  }

  /**
   * Adds command-line arguments needed to make parallel execution succeed.
   */
  function addFilterArgs(args) {
    var ui = path.resolve(__dirname, 'helpers', 'filter_ui.js');
    return addInternalArgs(args, ui);
  }

  /**
   * Adds command-line arguments needed to run only the skipped tests.
   */
  function addSkippedArgs(args) {
    var ui = path.resolve(__dirname, 'helpers', 'skipped_ui.js');
    return addInternalArgs(args, ui);
  }

  /**
   * Adds environment variables needed to make parallel execution succeed.
   */
  function addFilterVars(env, suite) {
    env.MOCHA_PARALLEL_SUITE = suite;
    return env;
  }

  /**
   * Invokes mocha and invokes the done callback with the exit code,
   * stdout and stderr when done.
   */
  function runMocha(mocha, args, env, onDone) {
    var child = child_process.spawn(mocha, args, {
      env: env
    });
    var stdout = '';
    var stderr = '';
    child.stdout.on('data', function (buf) {
      stdout += String(buf);
    });
    child.stderr.on('data', function (buf) {
      stderr += String(buf);
    });
    child.on('close', function(code) {
      onDone(code, stdout, stderr);
    });
  }

  /**
   * Run the named test suites in parallel with a concurrency limit.
   */
  function runTestsInParallel(suiteNames, options, onDone) {
    var success = true;
    var results = {};
    async.eachLimit(suiteNames, options.concurrency, function(suite, callback) {
      var args = addFilterArgs(options.args(suite));
      var env = addFilterVars(options.env(suite), suite);
      runMocha(options.mocha, args, env, function(code, stdout, stderr) {
        options.report(suite, code, stdout, stderr);
        if (code !== 0) {
          success = false;
        }
        results[suite] = {
          code: code,
          stdout: stdout,
          stderr: stderr
        };
        callback();
      });
    }, function() {
      options.done(success, results);
      onDone(success);
    });
  }

  /**
   * Run all skipped tests
   */
  function runSkippedTests(options, onDone) {
    var name = 'Skipped';
    var args = addSkippedArgs(options.args(name));
    var env = options.env(name);
    runMocha(options.mocha, args, env, function(code, stdout, stderr) {
      options.report(name, code, stdout, stderr);
      onDone();
    });
  }

  /**
   * Default reporting function: prints stdout followed by stderr
   */
  function reportResults(suite, code, stdout, stderr) {
    if (stdout.length) {
      process.stdout.write(stdout);
    }
    if (stderr.length) {
      process.stderr.write(stderr);
    }
  }

  var description = 'Run mocha test suites in paarallel';
  grunt.registerTask('mocha_parallel', description, function() {
    var done = this.async();
    var options = this.options({
      args: function() {
        return [];
      },
      env: function() {
        return process.env;
      },
      done: function() {
      },
      report: reportResults,
      mocha: './node_modules/.bin/mocha',
      concurrency: os.cpus().length * 1.5
    });

    getTopLevelSuiteNames(options, function(names) {
      runSkippedTests(options, function() {
        runTestsInParallel(names, options, done);
      });
    });
  });
};
