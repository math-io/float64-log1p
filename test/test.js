'use strict';

// MODULES //

var tape = require( 'tape' );
var abs = require( 'math-abs' );
var ln = require( 'math-ln' );
var incrspace = require( 'compute-incrspace' );
var pinf = require( 'const-pinf-float64' );
var ninf = require( 'const-ninf-float64' );
var log1p = require( './../lib' );


// FIXTURES //

var mediumNegative = require( './fixtures/medium_negative.json' );
var mediumPositive = require( './fixtures/medium_positive.json' );
var smallNegative = require( './fixtures/small_negative.json' );
var smallPositive = require( './fixtures/small_positive.json' );
var largeNegative = require( './fixtures/large_negative.json' );
var largePositive = require( './fixtures/large_positive.json' );
var tinyNegative = require( './fixtures/tiny_negative.json' );
var tinyPositive = require( './fixtures/tiny_positive.json' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( typeof log1p === 'function', 'main export is a function' );
	t.end();
});

tape( 'the function agrees with `ln(x+1)` for most `x`', function test( t ) {
	var expected;
	var delta;
	var val;
	var tol;
	var x;
	var y;
	var i;

	x = incrspace( -0.5, 1000, 0.5 );
	for ( i = 0; i < x.length; i++ ) {
		val = x[ i ];
		y = log1p( val );
		expected = ln( val + 1 );
		delta = abs( y - expected );
		tol = 1e-12 * Math.max( 1, abs( y ), abs( expected ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + val + '. Value: ' + y + '. Expected: ' + expected + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes `ln(x+1)` for negative medium numbers', function test( t ) {
	var expected;
	var delta;
	var tol;
	var v;
	var x;
	var i;

	x = mediumNegative.x;
	expected = mediumNegative.expected;

	for ( i = 0; i < x.length; i++ ) {
		v = log1p( x[ i ] );
		delta = abs( v - expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + x[ i ] + '. Value: ' + v + '. Expected: ' + expected[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes `ln(x+1)` for positive medium numbers', function test( t ) {
	var expected;
	var delta;
	var tol;
	var v;
	var x;
	var i;

	x = mediumPositive.x;
	expected = mediumPositive.expected;

	for ( i = 0; i < x.length; i++ ) {
		v = log1p( x[ i ] );
		delta = abs( v - expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + x[ i ] + '. Value: ' + v + '. Expected: ' + expected[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes `ln(x+1)` for negative small numbers', function test( t ) {
	var expected;
	var delta;
	var tol;
	var v;
	var x;
	var i;

	x = smallNegative.x;
	expected = smallNegative.expected;

	for ( i = 0; i < x.length; i++ ) {
		v = log1p( x[ i ] );
		delta = abs( v - expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + x[ i ] + '. Value: ' + v + '. Expected: ' + expected[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes `ln(x+1)` for positive small numbers', function test( t ) {
	var expected;
	var delta;
	var tol;
	var v;
	var x;
	var i;

	x = smallPositive.x;
	expected = smallPositive.expected;

	for ( i = 0; i < x.length; i++ ) {
		v = log1p( x[ i ] );
		delta = abs( v - expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + x[ i ] + '. Value: ' + v + '. Expected: ' + expected[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes `ln(x+1)` for negative tiny numbers', function test( t ) {
	var expected;
	var delta;
	var tol;
	var v;
	var x;
	var i;

	x = tinyNegative.x;
	expected = tinyNegative.expected;

	for ( i = 0; i < x.length; i++ ) {
		v = log1p( x[ i ] );
		delta = abs( v - expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + x[ i ] + '. Value: ' + v + '. Expected: ' + expected[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes `ln(x+1)` for positive tiny numbers', function test( t ) {
	var expected;
	var delta;
	var tol;
	var v;
	var x;
	var i;

	x = tinyPositive.x;
	expected = tinyPositive.expected;

	for ( i = 0; i < x.length; i++ ) {
		v = log1p( x[ i ] );
		delta = abs( v - expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + x[ i ] + '. Value: ' + v + '. Expected: ' + expected[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes `ln(x+1)` for negative large numbers', function test( t ) {
	var expected;
	var delta;
	var tol;
	var v;
	var x;
	var i;

	x = largeNegative.x;
	expected = largeNegative.expected;

	for ( i = 0; i < x.length; i++ ) {
		v = log1p( x[ i ] );
		delta = abs( v - expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + x[ i ] + '. Value: ' + v + '. Expected: ' + expected[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes `ln(x+1)` for positive large numbers', function test( t ) {
	var expected;
	var delta;
	var tol;
	var v;
	var x;
	var i;

	x = largePositive.x;
	expected = largePositive.expected;

	for ( i = 0; i < x.length; i++ ) {
		v = log1p( x[ i ] );
		delta = abs( v - expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + x[ i ] + '. Value: ' + v + '. Expected: ' + expected[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function returns `-infinity` if provided `-1`', function test( t ) {
	t.equal( log1p( -1 ), ninf, 'equals -infinity' );
	t.end();
});

tape( 'the function returns `+infinity` if provided `+infinity`', function test( t ) {
	t.equal( log1p( pinf ), pinf, 'equals +infinity' );
	t.end();
});

tape( 'the function returns `NaN` if provided a number smaller than -1', function test( t ) {
	var val = log1p( -2 );
	t.ok( val !== val, 'returns NaN' );
	t.end();
});

tape( 'the function returns `NaN` if provided `NaN`', function test( t ) {
	var val = log1p( NaN );
	t.ok( val !== val, 'returns NaN' );
	t.end();
});

tape( 'the function returns `0` if provided `+0`', function test( t ) {
	t.equal( log1p( 0 ), 0, 'equals 0' );
	t.end();
});

tape( 'the function returns `0` if provided `-0`', function test( t ) {
	t.equal( log1p( -0 ), 0, 'equals 0' );
	t.end();
});
