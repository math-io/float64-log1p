'use strict';

var log1p = require( './../lib' );

var x;
var i;

for ( i = 0; i < 100; i++ ) {
	x = Math.round( Math.random() * 100 );
	console.log( log1p( x ) );
}
