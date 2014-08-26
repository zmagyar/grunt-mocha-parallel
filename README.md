# grunt-mocha-parallel

> A Grunt task for running mocha test suites in parallel

## Getting Started

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-mocha-parallel --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with
this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mocha-parallel');
```

## The "mocha_parallel" task

### Overview

In your project's Gruntfile, add a section named `mocha_parallel` to the data
object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  mocha_parallel: {
    options: {
      args: function(suiteName) {
        return [];
      },
      env: function(suiteName) {
        return process.env;
      },
      report: function(suite, code, stdout, stderr) {
      },
      done: function(success, results) {
      },
      mocha: './node_modules/.bin/mocha',
      concurrency: os.cpus().length,
    },
  },
});
```

### Options

#### options.args

Type: `Function`
Default value: A function that returns an empty list.

A function that should return a list of mocha options to use when running the
named suite.

#### options.env

Type: `Function`
Default value: A function that returns `process.env`

A function that should return a custom environment hash to use when running the
named suite.

#### options.report

Type: `Function`
Default value: A function that logs the standard output followed by the standard
error for the named suite.

A function to invoke to report the results of a given suite.

#### options.done

Type: `Function`
Default value: A function that does nothing.

A function to invoke when all the suites have completed.  The first argument
is a boolean indicating if all suites succeeded or not, the second is a map
between suite name and the output of that suite (`code`, `stderr`, `stdout`).

#### options.mocha

Type: `String`
Default value: `./node_modules/.bin/mocha`

The path to the mocha binary to invoke.

#### options.concurrency
Type: `Number`
Default value: `os.cpus().length * 1.5`

Specifies the maxiumum number of concurrent test suites to run.

## Versioning

Releases will be numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

- Breaking backwards compatibility bumps the major
- New additions without breaking backwards compatibility bumps the minor
- Bug fixes and misc changes bump the patch

For more information on semantic versioning, please visit http://semver.org/.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## Release History

_(Nothing yet)_
