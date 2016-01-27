Natural Logarithm
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Computes the [natural logarithm][natural-logarithm] of 1 + x.


## Installation

``` bash
$ npm install math-log1p
```


## Usage

``` javascript
var log1p = require( 'math-log1p' );
```

#### log1p( x )

Computes the [natural logarithm][natural-logarithm].

``` javascript
var val = log1p( 4 );
// returns ~1.386

val = log1p( 0 );
// returns -infinity

val = log1p( Number.POSITIVE_INFINITY );
// returns +infinity
```

For negative numbers, the [natural logarithm][natural-logarithm] is __not__ defined.

``` javascript
var val = log1p( -4 );
// returns NaN
```


## Examples

``` javascript
var log1p = require( 'math-log1p' );

var x;
var i;

for ( i = 0; i < 100; i++ ) {
	x = Math.round( Math.random() * 100 );
	console.log( log1p( x ) );
}
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. The [Compute.io][compute-io] Authors.


[npm-image]: http://img.shields.io/npm/v/math-log1p.svg
[npm-url]: https://npmjs.org/package/math-log1p

[build-image]: http://img.shields.io/travis/math-io/log1p/master.svg
[build-url]: https://travis-ci.org/math-io/log1p

[coverage-image]: https://img.shields.io/codecov/c/github/math-io/log1p/master.svg
[coverage-url]: https://codecov.io/github/math-io/log1p?branch=master

[dependencies-image]: http://img.shields.io/david/math-io/log1p.svg
[dependencies-url]: https://david-dm.org/math-io/log1p

[dev-dependencies-image]: http://img.shields.io/david/dev/math-io/log1p.svg
[dev-dependencies-url]: https://david-dm.org/dev/math-io/log1p

[github-issues-image]: http://img.shields.io/github/issues/math-io/log1p.svg
[github-issues-url]: https://github.com/math-io/log1p/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[compute-io]: https://github.com/compute-io/
[natural-logarithm]: https://en.wikipedia.org/wiki/Natural_logarithm
