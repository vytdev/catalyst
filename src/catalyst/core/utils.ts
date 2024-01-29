/**
 * utility functions
 */

/**
 * calls a function and ignore exceptions
 */
export function safeCall<A extends any[], R extends any>(fn: (...args: A) => R, ...args: A): R {
	try {
		return fn(...args);
	} catch { /* no-op */ }
}

/**
 * converts milliseconds (from Date.now()) to string
 * @param ms the milliseconds value
 * @returns the resulting string
 */
export function msToString(ms: number): string {
	// scale:
	// sec           1,000 ms            1e+3
	// min           60,000 ms           6e+4
	// hour          3,600,000 ms        3.6e+6
	// day           86,400,000 ms       8.64e+7
	// week          604,800,000 ms      6.048e+8
	// month  30d    2,592,000,000 ms    2.592e+9
	// year   365d   31,536,000,000 ms   3.1536e+10

	let txt = '';

	[
		{ name: 'y', ms: 3.1536e+10 },
		{ name: 'mo', ms: 2.592e+9 },
		{ name: 'w', ms: 6.048e+8 },
		{ name: 'd', ms: 8.64e+7 },
		{ name: 'h', ms: 3.6e+6 },
		{ name: 'm', ms: 6e+4 },
		{ name: 's', ms: 1e+3 }
	].forEach(v => {
		if (ms < v.ms) return;
		txt += ' ' + Math.floor(ms / v.ms) + v.name;
		ms = ms % v.ms;
	});

	return txt.slice(1);
}

/**
 * compress number
 * @param n the number
 * @returns resulting string
 */
export function compressNumber(n: number): string {
	// zero or NaN, return '0'
	if (!n) return '0';
	// our SI unit prefix list
	const prefixes = [ '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q' ];

	// how many groups of 3 decimal places are there?
	const magnitude = Math.floor(Math.log10(Math.abs(n)) / 3);
	// scale down the most significant digits
	const scaled = n / (10 ** (magnitude * 3));

	// string result
	return scaled.toFixed(1) + prefixes[magnitude];
}

/**
 * format numbers
 * @param n the number
 * @returns resulting string
 */
export function formatNumber(n: number): string {
	// thx: https://stackoverflow.com/questions/2901102
	return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
