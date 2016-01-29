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
* Method :
*   1. Argument Reduction: find k and f such that
*			1+x = 2^k * (1+f),
*	   where  sqrt(2)/2 < 1+f < sqrt(2) .
*
*      Note. If k=0, then f=x is exact. However, if k!=0, then f
*	may not be representable exactly. In that case, a correction
*	term is need. Let u=1+x rounded. Let c = (1+x)-u, then
*	log(1+x) - log(u) ~ c/u. Thus, we proceed to compute log(u),
*	and add back the correction term c/u.
*	(Note: when x > 2**53, one can simply return log(x))
*
*   2. Approximation of log1p(f).
*	Let s = f/(2+f) ; based on log(1+f) = log(1+s) - log(1-s)
*		 = 2s + 2/3 s**3 + 2/5 s**5 + .....,
*	     	 = 2s + s*R
*      We use a special Reme algorithm on [0,0.1716] to generate
* 	a polynomial of degree 14 to approximate R The maximum error
*	of this polynomial approximation is bounded by 2**-58.45. In
*	other words,
*		        2      4      6      8      10      12      14
*	    R(z) ~ Lp1*s +Lp2*s +Lp3*s +Lp4*s +Lp5*s  +Lp6*s  +Lp7*s
*  	(the values of Lp1 to Lp7 are listed in the program)
*	and
*	    |      2          14          |     -58.45
*	    | Lp1*s +...+Lp7*s    -  R(z) | <= 2
*	    |                             |
*	Note that 2s = f - s*f = f - hfsq + s*hfsq, where hfsq = f*f/2.
*	In order to guarantee error in log below 1ulp, we compute log
*	by
*		log1p(f) = f - (hfsq - s*(hfsq+R)).
*
*	3. Finally, log1p(x) = k*ln2 + log1p(f).
*		 	     = k*ln2_hi+(f-(hfsq-(s*(hfsq+R)+k*ln2_lo)))
*	   Here ln2 is split into two floating point number:
*			ln2_hi + ln2_lo,
*	   where n*ln2_hi is always exact for |n| < 2000.
*
* Special cases:
*	log1p(x) is NaN with signal if x < -1 (including -INF) ;
*	log1p(+INF) is +INF; log1p(-1) is -INF with signal;
*	log1p(NaN) is that NaN with no signal.
*
* Accuracy:
*	according to an error analysis, the error is always less than
*	1 ulp (unit in the last place).
*
* Constants:
* The hexadecimal values are the intended ones for the following
* constants. The decimal values may be used, provided that the
* compiler will convert from decimal to binary accurately enough
* to produce the hexadecimal values shown.
*
* Note: Assuming log() return accurate answer, the following
* 	 algorithm can be used to compute log1p(x) to within a few ULP:
*
*		u = 1+x;
*		if(u==1.0) return x ; else
*			   return log(u)*(x/(u-1.0));
*
*	 See HP-15C Advanced Functions Handbook, p.193.
*/

// MODULES //

var highWord = require( 'math-float64-get-high-word' );
var setHighWord = require( 'math-float64-set-high-word' );


// CONSTANTS //

var PINF = require( 'const-pinf-float64' );
var NINF = require( 'const-ninf-float64' );

// High and low words of ln(2):
var LN2_HI = 6.93147180369123816490e-01; // 0x3fe62e42 0xfee00000
var LN2_LO = 1.90821492927058770002e-10; // 0x3dea39ef 0x35793c76

// 2**54:
var TWO54 = 1.80143985094819840000e+16; // 0x43500000 0x00000000

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
*	Computes the natural logarithm of 1 + x.
*
* @param {Number} x - input value
* @returns {Number} function value
*/
function log1p( x ) {
	var hfsq;
	var f;
	var c;
	var s;
	var z;
	var R;
	var u;
	var k;
	var hx;
	var hu;
	var ax;

	// Special Cases:
	if ( x < -1 || x !== x ) {
		return NaN;
	}
	if ( x === -1 ) {
		return NINF;
	}
	if ( x === PINF ) {
		return PINF;
	}

	hx = highWord( x );		/* high word of x */
	ax = hx & 0x7fffffff;

	k = 1;
	if ( hx < 0x3FDA827A ) {			/* x < 0.41422  */
		if ( ax < 0x3e200000 ) {			/* |x| < 2**-29 */
			if( TWO54 + x > 0 && ax < 0x3c900000 ) {	/* |x| < 2**-54 */
				return x;
			} else {
				return x - x*x * 0.5;
			}
		}
		if ( hx > 0 || hx <= 0xbfd2bec3 ) {
			k = 0;
			f = x;
			hu = 1;
		}	/* -0.2929<x<0.41422 */
	}
	if ( hx >= 0x7ff00000 ) {
		return x + x;
	}
	if ( k !== 0 ) {
		if ( hx<0x43400000 ) {
			u  = 1.0 + x;
			hu = highWord( u );		/* high word of u */
			k  = ( hu >> 20 ) - 1023;
			c  = ( k > 0 ) ? 1.0 - ( u - x ) : x - ( u - 1.0 );		/* correction term */
			c /= u;
		} else {
			u  = x;
			hu = highWord( u );		/* high word of u */
			k  = ( hu >> 20 ) - 1023;
			c  = 0;
		}
		hu &= 0x000fffff;
		if( hu < 0x6a09e ) {
			u = setHighWord( u, hu|0x3ff00000 );	/* normalize u */
		} else {
			k += 1;
			u = setHighWord( u, hu|0x3fe00000 );	/* normalize u/2 */
			hu = ( 0x00100000 - hu ) >> 2;
		}
		f = u - 1.0;
	}
	hfsq = 0.5 * f * f;
	if( hu === 0 ) {	/* |f| < 2**-20 */
		if ( f === 0 ) {
			if ( k === 0 ) {
				return 0;
			} else {
				c += k * LN2_LO;
				return k * LN2_HI + c;
			}
		}
		R = hfsq * ( 1.0 - 0.66666666666666666 * f );
		if ( k === 0 ) {
			return f - R;
		} else {
			return k * LN2_HI - ( ( R - ( k * LN2_LO + c ) ) - f );
		}
	}
 	s = f / ( 2.0 + f );
	z = s * s;
	R = z * ( Lp1 + z * ( Lp2 + z * (Lp3+z*(Lp4+z*(Lp5+z*(Lp6+z*Lp7)))) ) );
	if ( k ===0 ) {
		return f - ( hfsq - s * (hfsq+R) );
	}
	return k * LN2_HI - ( ( hfsq - ( s*(hfsq+R) + (k*LN2_LO+c) ) ) - f );
} // end FUNCTION log1p()


// EXPORTS //

module.exports = log1p;
