/**
 * localization helpers
 */

/**
 * a string wrapper for translatable strings
 * @param text the translation text
 * @returns callable to format the string
 */
export function localize(text: string): (...args: any[]) => string {
	return (...args: any[]) => formatString(text, ...args);
}

/**
 * formats a string
 * @param format the format string
 * @param [args] the arguments
 * @returns formatted string
 */
export function formatString(format: string, ...args: any[]): string {
	// constants
	const digits = '0123456789';

	const len = format.length;
	let i = 0;
	const argLen = args.length;
	let argIdx = 0;

	// returns next arg
	const getNextArg = (idx?: number) => {
		if (!args)
			throw new TypeError('insufficient arguments');
		if (typeof idx == 'number' && idx > argLen)
			throw new TypeError('missing format argument: ' + idx);
		if (argIdx >= argLen) throw new TypeError('insufficient arguments');
		return args[idx != null ? (idx - 1) : argIdx++];
	};

	let txt = '';

	// placeholder format
	// %[index$][flag][width][.precision][size][length]specifier

	while (i < len) {
		let c = format[i++];

		// skip raw text
		while (c != '%' && i <= len) {
			txt += c;
			c = format[i++];
		}
		// trailing %
		if (c == '%' && i >= len)
			throw new TypeError("format string contains trailing '%'");
		// maybe the last text
		if (i >= len) break;

		const placeholderStart = i - 1;

		// skip the percent sign
		c = format[i++];

		// the arg index
		let index = null;
		// define flags
		let plus  = false;
		let minus = false;
		let hash  = false;
		let space = false; // ignored when + is present
		let zero  = false; // ignored when - is present
		// values
		let minFieldWidth = null;
		let precision = null;
		let lengthModifier = '';

		// first step:
		// parse the format parameter placeholder

		// arg index
		if (/^[1-9]\d*\$/.test(format.slice(i - 1))) {
			const num = format.slice(i - 1).match(/^([1-9]\d*)\$/)[1];
			index = +num;
			i += num.length;
			c = format[i++];
		}

		// set flags
		while ('+-# 0'.includes(c) && i < len) {
			if (c == '+') plus  = true;
			if (c == '-') minus = true;
			if (c == '#') hash  = true;
			if (c == ' ') space = true;
			if (c == '0') zero  = true;
			c = format[i++];
		}

		if (!c) throw new TypeError('incomplete format specifier');

		// min field width
		if (digits.includes(c)) {
			const raw = format.slice(i - 1).match(/^\d+/)[0];
			minFieldWidth = parseInt(raw);
			i += raw.length - 1;
			c = format[i++];
		}
		else if (c == '*') {
			minFieldWidth = getNextArg();
			if (typeof minFieldWidth != 'number')
				throw new TypeError('expected number for minimum field width');
			minFieldWidth = Math.floor(minFieldWidth);
			c = format[i++];
		}

		// precision
		if (c == '.') {
			if (!c) throw new TypeError('incomplete format specifier');
			c = format[i++];

			// value given on the specifier itself
			if (digits.includes(c)) {
				const raw = format.slice(i - 1).match(/^\d+/)[0];
				precision = parseInt(raw);
				i += raw.length - 1;
				c = format[i++];
			}
			// value supplied on args
			else if (c == '*') {
				precision = getNextArg();
				if (typeof precision != 'number')
					throw new TypeError('expected number for precision');
				precision = Math.floor(precision);
				c = format[i++];
			}

		}

		// length modifier
		if ('hljztL'.includes(c)) {
			if (!c) throw new TypeError('incomplete format specifier');
			lengthModifier = c;
			c = format[i++];
			if ((lengthModifier == 'h' && c == 'h') || (lengthModifier == 'l' && c == 'l')) {
				lengthModifier += c;
				c = format[i++];
			}
		}

		// next step:
		// process the placeholder by type specifier

		if (!c) throw new TypeError('incomplete format specifier');

		// the format specifier
		const placeholder = format.slice(placeholderStart, i);

		let source: any;
		let arg = '';

		// validate conversion specifier
		if (!'%#csdiobxXufFeEaAgG'.includes(c)) throw new TypeError('unknown conversion specifier: ' + c);

		// % specifier
		if (c == '%') arg = '%';
		else source = getNextArg(index);

		// automatic type conversion
		if (c == '#') {
			if (typeof source == 'number') c = 'g';
			else if (typeof source == 'string') c = 's';
			else arg = String(source);
		}

		// g and G specifier
		// special number placeholder
		let numberSpecifier = false;
		if (c == 'g' || c == 'G') {
			if (typeof source != 'number')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);

			// exponent of number
			const exp = Math.floor(Math.log10(Math.abs(source)));
			// internal flag for f F e and E
			numberSpecifier = true;
			// precision
			precision = (precision ?? 6) || 1;

			// normal float
			if (precision > exp && exp >= -4) {
				c = c == 'g' ? 'f' : 'F';
				precision = precision - 1 - exp;
			}

			// scientific notation
			else {
				c = c == 'g' ? 'e' : 'E';
				precision = precision - 1;
			}
		}

		// c specifier
		// write a single character
		if (c == 'c') {
			if (typeof source == 'string') arg = source[0];
			else if (typeof source == 'number') arg = String.fromCharCode(source);
			else throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);
		}

		// s specifier
		// writes a string
		if (c == 's') {
			if (typeof source != 'string')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);
			arg = source.slice(0, precision ?? source.length);
		}

		// d and i specifier
		// writes integers
		if (c == 'd' || c == 'i') {
			if (typeof source != 'number')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);
			source = Math.round(source); // remove decimals

			// if the arg is a positive number, add the sign or put a space
			// based on flags
			if (source >= 0) {
				if (plus) arg += '+';
				else if (space) arg += ' ';
			}

			// set the arg
			arg += source;
			arg = arg.padStart(precision, '0');
			// no result
			if (source == 0 && precision == 0) arg = '';
		}

		// o specifier
		// writes octals
		if (c == 'o') {
			if (typeof source != 'number')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);
			source = Math.round(source); // remove decimals

			// encode arg into octal
			arg += source.toString(8);
			// padding
			if (!minus && zero) arg = arg.padStart(minFieldWidth, "0");
			// no result
			if (source == 0 && precision == 0) arg = '';
			// precision padding
			arg = arg.padStart(precision, "0");
			// prefix 0
			if (hash) arg = '0' + arg;
		}

		// b specifier (custom)
		// writes binary
		if (c == 'b') {
			if (typeof source != 'number')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);
			source = Math.round(source); // remove decimals

			// encode arg into octal
			arg += source.toString(2);
			// padding
			if (!minus && zero) arg = arg.padStart(minFieldWidth, "0");
			// precision padding
			arg = arg.padStart(precision, "0");
			// prefix '0b'
			if (hash) arg = '0b' + arg;
			// no result
			if (source == 0 && precision == 0) arg = '';
		}

		// x and X specifier
		// writes hexadecimals
		if (c == 'x' || c == 'X') {
			if (typeof source != 'number')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);
			source = Math.round(source); // remove decimals

			// encode arg into hexadecimal
			arg += source.toString(16);
			// padding
			if (!minus && zero) arg = arg.padStart(minFieldWidth, "0");
			// precision padding
			arg = arg.padStart(precision, "0");
			// '0x' prefix
			if (hash) arg = '0' + c + arg;
			// specifier is capital X, use capital letters
			if (c == 'X') arg = arg.toUpperCase();
			// no result
			if (source == 0 && precision == 0) arg = '';
		}

		// u specifier
		// writes unsigned integers
		if (c == 'u') {
			if (typeof source != 'number')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);
			source = Math.round(source); // remove decimals

			// make arg string
			arg += source >>> 0;
			// padding
			if (!minus && zero) arg = arg.padStart(minFieldWidth, "0");
			// precision padding
			arg = arg.padStart(precision, "0");
			// no result
			if (source == 0 && precision == 0) arg = '';
		}

		// f and F specifier
		// writes floating point numbers
		if (c == 'f' || c == 'F') {
			if (typeof source != 'number')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);

			// if the arg is a positive number, add the sign or put a space
			// based on flags
			if (source >= 0) {
				if (plus) arg += '+';
				else if (space) arg += ' ';
			}

			// fixed precision
			if (numberSpecifier && (!hash || (source % 1 === 0)))
				arg += source.toString().replace(new RegExp(`(\\d+(?:\\.\\d{${precision}}))\\d*`), "$1");
			else arg += source.toFixed(precision ?? 6);
			// alternate form: a dot even no digits follow it
			if (hash && precision == 0) arg += '.';
			// for g G specifier
			if (numberSpecifier && hash && !arg.includes('.')) arg += '.';
			// leading zeros
			if (!minus && zero) arg = arg.padStart(minFieldWidth, "0");
		}

		// e and E specifier
		// writes floating point numbers in scientific notation
		if (c == 'e' || c == 'E') {
			if (typeof source != 'number')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);

			// if the arg is a positive number, add the sign or put a space
			// based on flags
			if (source >= 0) {
				if (plus) arg += '+';
				else if (space) arg += ' ';
			}

			const magnitude = Math.floor(Math.log10(Math.abs(source)));
			const scale = source / (10 ** magnitude);

			// fixed precision
			let n = (source == 0 ? 0 : scale).toFixed(precision ?? 6);
			if (numberSpecifier && !hash)
				n = n.replace(new RegExp(`(\\d+(?:\\.\\d{${precision}}))\\d*`), "$1")
					.replace(/(?<=\.\d*)0+$/, '')
					.replace(/\.$/, '');
			// leading zeros
			if (!minus && zero) n = n.padStart(minFieldWidth, "0");
			// alternate form
			if (hash && precision == 0) n += '.';
			arg += n + 'e';
			// the magnitude
			if (magnitude >= 0 || source == 0) arg += '+';
			arg += source == 0 ? '0' : magnitude.toString().padStart(2, '0');
			// upper case
			if (c == 'E') arg = arg.toUpperCase();
		}

		// a and A specifier
		// writes floating point numbers in *hexadecimal* scientific notation
		if (c == 'a' || c == 'A') {
			if (typeof source != 'number')
				throw new TypeError(`type ${typeof source} is not assignable to placeholder ${placeholder}`);

			// if the arg is a positive number, add the sign or put a space
			// based on flags
			if (source >= 0) {
				if (plus) arg += '+';
				else if (space) arg += ' ';
			}

			const magnitude = Math.floor((Math.log(Math.abs(source)) / Math.log(16)));
			const scale = source / (16 ** magnitude);

			// hex prefix
			arg += '0x';
			// fixed precision
			let n = scale.toString(16);
			n = n.replace(
				new RegExp(`^([\\da-fA-F]+(?:\\.[\\da-fA-F]{${precision}}))[\\da-fA-F]*$`)
				, "$1").replace(/(?<=\.\d*)0+$/, '');
			if (source == 0) n = '0';
			// leading zeros
			if (!minus && zero) n = n.padStart(minFieldWidth, "0");
			// alternate form
			if (hash && precision == 0) n += '.';
			arg += n + 'p';
			// the magnitude
			if (magnitude >= 0 || source == 0) arg += '+';
			arg += source == 0 ? '0' : magnitude.toString().padStart(1, '0');
			// upper case
			if (c == 'A') arg = arg.toUpperCase();
		}

		// some post modifications
		if (minus) arg = arg.padEnd(minFieldWidth, " ");
		else if (zero && !plus) arg = arg.padStart(minFieldWidth, "0");
		else arg = arg.padStart(minFieldWidth, " ");

		// append this arg
		txt += arg;
	}

	// return the resulting formatted text
	return txt;
}
