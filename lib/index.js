'use strict';

/**
* NOTE: the original C code, the long comment, copyright, license, and the constants are from [netlib]{http://www.netlib.org/fdlibm/s_log1p.c}.
*
* The implementation follows the original, but has been modified for JavaScript.
*/

/**
* ====================================================
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunSoft, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ====================================================
*/

/**
* double log1p(double x)
*
*  Method :
*    1. Argument Reduction: find k and f such that
*
*        1+x = 2^k * (1+f)
*    
*      where  sqrt(2)/2 < 1+f < sqrt(2).
*
*      Note: if k=0, then f=x is exact. However, if k!=0, then f may not be representable exactly. In that case, a correction term is needed. Let u=1+x rounded. Let c = (1+x)-u, then
*
*        log(1+x) - log(u) ~ c/u
*
*      Thus, we proceed to compute log(u), and add back the correction term c/u.
*
*      Note: when x > 2**53, one can simply return log(x).
*
*   2. Approximation of log1p(f).
*     Let s = f/(2+f); based on
*
*        log(1+f) = log(1+s) - log(1-s)
*                 = 2s + 2/3 s**3 + 2/5 s**5 + ...
*                 = 2s + s*R
*
*     We use a special Reme algorithm on [0,0.1716] to generate a polynomial of degree 14 to approximate R. The maximum error of this polynomial approximation is bounded by 2**-58.45. In other words,
*
*                 2      4      6      8      10      12      14
*        R(z) ~ Lp1*s +Lp2*s +Lp3*s +Lp4*s +Lp5*s  +Lp6*s  +Lp7*s
*
*     (Note: the values of Lp1 to Lp7 are listed in the program.)
*
*     and
*
*        |      2          14          |     -58.45
*        | Lp1*s +...+Lp7*s    -  R(z) | <= 2
*        |                             |
*
*     Note that
*
*        2s = f - s*f
*           = f - hfsq + s*hfsq
*
*     where hfsq = f*f/2.
*
*     In order to guarantee error in log below 1 ulp, we compute log by
*
*        log1p(f) = f - (hfsq - s*(hfsq+R)).
*
*	3. Finally,
*
*        log1p(x) = k*ln2 + log1p(f).
*                 = k*ln2_hi+(f-(hfsq-(s*(hfsq+R)+k*ln2_lo)))
*
*     Here ln2 is split into two floating point numbers:
*
*        ln2_hi + ln2_lo
*
*     where n*ln2_hi is always exact for |n| < 2000.
*
*   Special cases:
*     log1p(x) is NaN with signal if x < -1 (including -INF)
*     log1p(+INF) is +INF
*     log1p(-1) is -INF with signal
*     log1p(NaN) is NaN with no signal
*
*   Accuracy:
*     according to an error analysis, the error is always less than 1 ulp (unit in the last place).
*
*   Constants:
*     The hexadecimal values are the intended ones for the following constants. The decimal values may be used, provided that the compiler will convert from decimal to binary accurately enough to produce the hexadecimal values shown.
*
*   Note:
*     Assuming log() returns accurate answer, the following algorithm can be used to compute log1p(x) to within a few ULP:
*
*        u = 1+x;
*        if(u==1.0) return x;
*        else       return log(u)*(x/(u-1.0));
*
*     See HP-15C Advanced Functions Handbook, p.193.
*/

// MODULES //

var highWord = require( 'math-float64-get-high-word' );
var setHighWord = require( 'math-float64-set-high-word' );


// CONSTANTS //

var PINF = require( 'const-pinf-float64' );
var NINF = require( 'const-ninf-float64' );

var BIAS = 1023;

// High and low words of ln(2):
var LN2_HI = 6.93147180369123816490e-01; // 0x3fe62e42 0xfee00000
var LN2_LO = 1.90821492927058770002e-10; // 0x3dea39ef 0x35793c76

// sqrt(2)-1:
var SQRT2M1 = 4.142135623730950488017e-01;  // 0x3fda8279 0x99fcef34

// sqrt(2)/2-1:
var SQRT2HALFM1 = -2.928932188134524755992e-01; // 0xbfd2bec3 0x33018866

// 2**-29:
var SMALL = 1.862645149230957e-09; // 0x3e200000 0x00000000

// 2**-54:
var TINY = 5.551115123125783e-17;

// Max unsafe integer => 2**53:
var TWO53 = 9007199254740992;

// 2/3:
var TWO_THIRDS = 6.666666666666666666e-01;

// Polynomial coefficients:
var Lp1 = 6.666666666666735130e-01; // 0x3FE55555 0x55555593
var Lp2 = 3.999999999940941908e-01; // 0x3FD99999 0x9997FA04
var Lp3 = 2.857142874366239149e-01; // 0x3FD24924 0x94229359
var Lp4 = 2.222219843214978396e-01; // 0x3FCC71C5 0x1D8E78AF
var Lp5 = 1.818357216161805012e-01; // 0x3FC74664 0x96CB03DE
var Lp6 = 1.531383769920937332e-01; // 0x3FC39A09 0xD078C69F
var Lp7 = 1.479819860511658591e-01; // 0x3FC2F112 0xDF3E5244


// LOG1P //

/**
* FUNCTION: log1p( x )
*	Computes the natural logarithm of `1+x`.
*
* @param {Number} x - input value
* @returns {Number} function value
*/
function log1p( x ) {
	var hfsq;
	var hu;
	var y;
	var f;
	var c;
	var s;
	var z;
	var R;
	var u;
	var k;

	if ( x < -1 || x !== x ) {
		return NaN;
	}
	if ( x === -1 ) {
		return NINF;
	}
	if ( x === PINF ) {
		return PINF;
	}
	if ( x === 0 ) {
		return 0;
	}
	// Set y = |x|:
	if ( x < 0 ) {
		y = -x;
	} else {
		y = x;
	}
	// Argument reduction...
	k = 1;

	// Check if argument reduction is needed and if we can just return a small value approximation requiring less computation but with equivalent accuracy...
	if ( y < SQRT2M1 ) { // if |x| < sqrt(2)-1 => ~0.41422
		if ( y < SMALL ) { // if |x| < 2**-29
			if( y < TINY ) { // if |x| < 2**-54
				return x;
			}
			// Use a simple two-term Taylor series...
			return x - x*x*0.5;
		}
		// Check if `f=x` can be represented exactly (no need for correction terms), allowing us to bypass argument reduction...
		if ( x > SQRT2HALFM1 ) { // if x > sqrt(2)/2-1 => ~-0.2929
			// => -0.2929 < x < 0.41422
			k = 0;
			f = x; // exact
			hu = 1;
		}
	}
	// Address case where `f` cannot be represented exactly...
	if ( k !== 0 ) {
		if ( y < TWO53 ) {
			u = 1.0 + x;
			hu = highWord( u );

			// Bit shift to isolate the exponent and then subtract the bias:
			k = (hu>>20) - BIAS;

			// Correction term...
			if ( k > 0 ) { // positive unbiased exponent
				c = 1.0 - (u-x);
			} else { // nonpositive unbiased exponent
				c = x - (u-1.0);
			}
			c /= u;
		} else {
			u = x;
			hu = highWord( u );

			// Bit shift to isolate the exponent and then subtract the bias:
			k = (hu>>20) - BIAS;

			// Correction term is zero:
			c = 0;
		}
		// Apply a bit mask (0 00000000000 11111111111111111111) to remove the exponent:
		hu &= 0x000fffff; // max value => 1048575

		// Check if u significand is less than sqrt(2) significand => 0x6a09e => 01101010000010011110
		if ( hu < 434334 ) {
			// Normalize u by setting the exponent to 1023 (bias) => 0x3ff00000 => 0 01111111111 00000000000000000000
			u = setHighWord( u, hu|0x3ff00000 );
		} else {
			k += 1;

			// Normalize u/2 by setting the exponent to 1022 (bias-1 => 2**-1 = 1/2) => 0x3fe00000 => 0 01111111110 00000000000000000000
			u = setHighWord( u, hu|0x3fe00000 );

			// Subtract hu significand from next largest hu => 0 00000000001 00000000000000000000 => 0x00100000 => 1048576
			hu = (1048576-hu)>>2;
		}
		f = u - 1.0;
	}
	// Approximation of log1p(f)...
	hfsq = 0.5 * f * f;
	if( hu === 0 ) { // if |f| < 2**-20
		if ( f === 0 ) {
			c += k * LN2_LO;
			return k * LN2_HI + c;
		}
		R = hfsq * (1.0 - TWO_THIRDS*f); // avoid division
		return k*LN2_HI - ( (R - (k*LN2_LO + c)) - f );
	}
	s = f / (2.0 + f);
	z = s * s;

	// TODO: use math-polyval
	R = z * (Lp1+z*(Lp2+z*(Lp3+z*(Lp4+z*(Lp5+z*(Lp6+z*Lp7))))));

	if ( k === 0 ) {
		return f - ( hfsq - s*(hfsq+R) );
	}
	return k*LN2_HI - ( (hfsq - (s*(hfsq+R) + (k*LN2_LO + c))) - f );
} // end FUNCTION log1p()


// EXPORTS //

module.exports = log1p;
