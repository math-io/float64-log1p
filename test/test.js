'use strict';

// MODULES //

var tape = require( 'tape' );
var abs = require( 'math-abs' );
var incrspace = require( 'compute-incrspace' );
var pinf = require( 'const-pinf-float64' );
var ninf = require( 'const-ninf-float64' );
var log1p = require( './../lib' );


// FIXTURES //

var small = require( './fixtures/small.json' );
var large = require( './fixtures/large.json' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( typeof log1p === 'function', 'main export is a function' );
	t.end();
});

tape( 'the function agrees with ln(x+1) for most x', function test( t ) {
	var delta;
	var tol;
	var expected;
	var x;
	var y;
	var val;
	var i;
	x = incrspace( 0, 1000, 0.5 );
	for ( i = 0; i < x.length; i++ ) {
		val = x[ i ];
		y = log1p( val );
		expected = Math.log( val + 1 );
		delta = abs( y - expected );
		tol = 1e-12 * Math.max( 1, abs( y ), abs( expected ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + val + '. Value: ' + y + '. Expected: ' + expected + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes ln(x+1) for very small x', function test( t ) {
	var delta;
	var tol;
	var v;
	var i;

	for ( i = 0; i < small.data.length; i++ ) {
		v = log1p( small.data[ i ] );
		delta = abs( v - small.expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( small.expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + small.data[ i ] + '. Value: ' + v + '. Expected: ' + small.expected[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function accurately computes ln(x+1) for very large x', function test( t ) {
	var delta;
	var tol;
	var v;
	var i;

	for ( i = 0; i < large.data.length; i++ ) {
		v = log1p( large.data[ i ] );
		delta = abs( v - large.expected[ i ] );
		tol = 1e-12 * Math.max( 1, abs( v ), abs( large.expected[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + large.data[ i ] + '. Value: ' + v + '. Expected: ' + large.expected[ i ] + '. Tolerance: ' + tol + '.' );
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
