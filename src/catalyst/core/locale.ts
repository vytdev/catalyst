/**
 * localization helpers
 */

/**
 * a string wrapper for translatable strings
 * @param text the translation text
 * @returns callable to format the string
 * @throws TypeError this can throw parsing errors
 */
export function localize(text: string): (...args: any[]) => string {
	const tokens = parseFormat(text);
	return (...args: any[]) => applyFormat(tokens, ...args);
}


/*
regex i made while refactoring the formatString function:
/^%(?:(?:([1-9]\d*)\$)?([\-+#0 ]*)([1-9]\d*)?(?:\.([1-9]\d*|\*))?(hh|ll|[hljztL])?([%?csdiobxXufFeEaAgG])|([1-9]\d*))$/

1: index
2: flags
3: min width field
4: precision
5: length modifier
6: specifier
7: index
*/

/**
 * format placeholder interface
 */
export interface formatPlaceHolder {
	text: string,

	/** argument index */
	argIndex: number,
	/** minimum field width */
	minFieldWidth: number|'*',
	/** precision */
	precision: number|'*',
	/** length modifier */
	lengthModifier?: 'hh'|'h'|'ll'|'l'|'j'|'z'|'t'|'L',
	/** conversion specifier */
	specifier: '%'|'?'|'c'|'s'|'d'|'i'|'o'|'b'|'x'|'X'|'u'|'f'|'F'|'e'|'E'|'a'|'A'|'g'|'G',

	// flags
	alternate: boolean, // #
	leftAlign: boolean, // -
	plusSign:  boolean, // +
	spaceSign: boolean, // <space>
	zeroPad:   boolean, // 0
}

/**
 * fornat tokens
 */
export type formatTokens = (formatPlaceHolder | string)[];

/**
 * parse a format string into tokens
 * @param format the format string to tokenize
 * @returns the tokens
 * @throws TypeError this can throw errors
 */
export function parseFormat(format: string): formatTokens {
	const tokens: formatTokens = [];

	const len = format.length;
	let i = 0;

	// translate next chars to number
	const getNum = () => {
		const num = format.slice(i - 1).match(/^\d+/)?.[0];
		if (!num) return -1;
		i += num.length;
		return +num;
	};

	// check if letter is a digit
	const isDigit = (c: string) => {
		return '0123456789'.includes(c);
	}

	// iterate through the format
	while (i < len) {
		let c = format[i++];

		// raw text
		let txt = '';
		while (c != '%' && i <= len) {
			txt += c;
			c = format[i++];
		}
		// add the text
		if (txt.length) {
			// last token is a string, concat this
			if (typeof tokens[tokens.length - 1] == 'string')
				tokens[tokens.length - 1] += txt;
			// new token item
			else tokens.push(txt);
		}
		// trailing '%'
		if (c == '%' && i >= len)
			throw new TypeError('format string contains trailing \'%\'');
		// no chars left
		if (i >= len) break;

		const placeHolderStart = i - 1;

		// skip the '%'
		c = format[i++];

		// initial placeholder token
		const token: formatPlaceHolder = {
			text: '%',
			argIndex: -1,
			minFieldWidth: null,
			precision: null,
			lengthModifier: null,
			specifier: null,
			alternate: false,
			leftAlign: false,
			plusSign: false,
			spaceSign: false,
			zeroPad: false,
		};

		// arg index
		if (/^[1-9]\d*\$/.test(format.slice(i - 1))) {
			token.argIndex = getNum();
			c = format[i++];
		}

		// set flags
		while ('+-# 0'.includes(c) && i < len) {
			if (c == '+') token.plusSign  = true;
			if (c == '-') token.leftAlign = true;
			if (c == '#') token.alternate = true;
			if (c == ' ') token.spaceSign = true;
			if (c == '0') token.zeroPad   = true;
			c = format[i++];
		}

		// set flags based on conditions
		if (token.plusSign) token.spaceSign = false;
		if (token.leftAlign) token.zeroPad = false;

		// incomplete format
		if (!c) throw new TypeError('incomplete format specifier');

		// min field width
		if (c == '*') {
			// get value from args
			token.minFieldWidth = '*';
			c = format[i++];
		} else if (isDigit(c)) {
			// value is given on the placeholder
			token.minFieldWidth = getNum();
			i -= 1;
			c = format[i++];
		}

		// precision
		if (c == '.') {
			c = format[i++];
			if (!c) throw new TypeError('incomplete format specifier');
			// get the value
			if (c == '*') {
				// get value from args
				token.precision = '*';
				c = format[i++];
			} else if (isDigit(c)) {
				// value is given on the placeholder
				token.precision = getNum();
				i -= 1;
				c = format[i++];
			}
		}

		// length modifier
		if ('hljztL'.includes(c)) {
			if (!c) throw new TypeError('incomplete format specifier');
			token.lengthModifier = c as formatPlaceHolder['lengthModifier'];
			c = format[i++];
			// double h or double l
			if (
				(token.lengthModifier == 'h' && c == 'h') ||
				(token.lengthModifier == 'l' && c == 'l')
			) {
				token.lengthModifier += c;
				c = format[i++];
			}
		}

		// incomplete format
		if (!c) throw new TypeError('incomplete format specifier');

		// check if c is a specifier
		if (!'%?csdiobxXufFeEaAgG'.includes(c))
			throw new TypeError('unknown conversion specifier: ' + c);

		// the specifier
		token.specifier = c as formatPlaceHolder['specifier'];

		// placeholder full text
		token.text = format.slice(placeHolderStart, i);

		// only escaped '%'
		if (c == '%') {
			// last token is a string, concat this
			if (typeof tokens[tokens.length - 1] == 'string')
				tokens[tokens.length - 1] += c;
			// new token item
			else tokens.push(c);
		}
		// a token
		else tokens.push(token);

	}

	// the result
	return tokens;
}

/**
 * applies a format
 * @param format the tokenized format
 * @param args[] arguments to use for formatting
 * @returns the resulting string
 * @throws TypeError this can throw errors
 */
export function applyFormat(format: formatTokens, ...args: any[]): string {
	let txt = '';
	let argIdx = 0;

	// returns next arg or arg at given index
	const getNextArg = (idx?: number) => {
		if (!args)
			throw new TypeError('insufficient arguments');
		if (typeof idx == 'number' && idx > args.length)
			throw new TypeError('missing format argument: ' + idx);
		if (argIdx >= args.length) throw new TypeError('insufficient arguments');
		return args[idx != null ? (idx - 1) : argIdx++];
	};

	// loop through tokens
	for (const tok of format) {
		// token is a raw sting, continue
		if (typeof tok == 'string') {
			txt += tok;
			continue;
		}

		// the conversion specifier
		let spec = tok.specifier;

		let minFieldWidth = tok.minFieldWidth;
		let precision = tok.precision;

		// min field width
		if (minFieldWidth == '*') {
			minFieldWidth = getNextArg();
			// validate value
			if (typeof minFieldWidth != 'number')
				throw new TypeError('expected number for minimum field width');
		}
		// precision
		if (precision == '*') {
			precision = getNextArg();
			// validate value
			if (typeof precision != 'number')
				throw new TypeError('expected number for precision');
		}

		// the subject argument
		let source = getNextArg(tok.argIndex == -1 ? null : tok.argIndex);
		let arg = '';

		// validate conversion specifier
		if (!'%?csdiobxXufFeEaAgG'.includes(spec))
			throw new TypeError('unknown conversion specifier: ' + spec);

		// incompatible types error
		const invalidArg = () => {
			throw new TypeError(`type ${typeof source} is not assignable to placeholder ${tok.text}`);
		}

		// automatic type conversion
		if (spec == '?') {
			if (typeof source == 'number') spec = 'g';
			else if (typeof source == 'string') spec = 's';
			else arg = String(source);
		}

		// 'g' and 'G' specifier
		// special number placeholder
		let numberSpecifier = false;
		if (spec == 'g' || spec == 'G') {
			if (typeof source != 'number') invalidArg();

			// exponent of number
			const exp = Math.floor(Math.log10(Math.abs(source)));
			// internal flag for f F e and E
			numberSpecifier = true;
			// precision
			precision = (precision ?? 6) || 1;

			// normal float
			if (precision > exp && exp >= -4) {
				spec = spec == 'g' ? 'f' : 'F';
				precision = precision - 1 - exp;
			}

			// scientific notation
			else {
				spec = spec == 'g' ? 'e' : 'E';
				precision = precision - 1;
			}
		}

		// 'c' specifier
		// writes a single character
		if (spec == 'c') {
			if (typeof source == 'string') arg += source[0];
			else if (typeof source == 'number') arg += String.fromCharCode(source);
			else invalidArg();
		}

		// 's' specifier
		// writes a string
		if (spec == 's') {
			if (typeof source != 'string') invalidArg();
			arg = source.slice(0, precision ?? source.length);
		}

		// 'd' and 'i' specifier
		// writes signed integers
		if (spec == 'd' || spec == 'i') {
			if (typeof source != 'number') invalidArg();
			// remove decimals
			source = Math.round(source);

			// if source is a positive number, add '+' or <space>
			if (source >= 0) {
				if (tok.plusSign) arg += '+';
				else if (tok.spaceSign) arg += ' ';
			}

			// set the arg
			arg += source.toString().padStart(precision ?? 1, '0');
			// padding
			if (!tok.leftAlign && tok.zeroPad) arg = arg.padStart(minFieldWidth, "0");
			// no result
			if (source == 0 && precision == 0) arg = '';
		}

		// 'o' specifier
		// writes unsigned octals
		if (spec == 'o') {
			if (typeof source != 'number') invalidArg();
			// absolute value
			source = Math.abs(source);
			// remove decimals
			source = Math.round(source);

			// alternate form
			if (tok.alternate) arg += '0';
			// convert to octal
			arg += source.toString(8);
			// padding
			if (!tok.leftAlign && tok.zeroPad) arg = arg.padStart(minFieldWidth, "0");
			// precision padding
			arg = arg.padStart(precision ?? 1, '0');
			// only one zero
			if (source == 0 && precision == 0) {
				// no result
				arg = '';
				// atleast 1 zero
				if (tok.alternate) arg = '0';
			}
		}

		// 'b' specifier (custom)
		// writes unsigned binary
		if (spec == 'b') {
			if (typeof source != 'number') invalidArg();
			source = Math.round(source); // remove decimals

			// encode arg into octal
			arg += source.toString(2);
			// padding
			if (!tok.leftAlign && tok.zeroPad) arg = arg.padStart(minFieldWidth, "0");
			// precision padding
			arg = arg.padStart(precision, "0");
			// prefix '0b'
			if (tok.alternate) arg = '0b' + arg;
			// no result
			if (source == 0 && precision == 0) arg = '';
		}

		// 'x' and 'X' specifier
		// writes hexadecimals
		if (spec == 'x' || spec == 'X') {
			if (typeof source != 'number') invalidArg();
			source = Math.round(source); // remove decimals

			// encode arg into hexadecimal
			arg += source.toString(16);
			// padding
			if (!tok.leftAlign && tok.zeroPad) arg = arg.padStart(minFieldWidth, "0");
			// precision padding
			arg = arg.padStart(precision, "0");
			// '0x' prefix
			if (tok.alternate) arg = '0' + spec + arg;
			// specifier is capital X, use capital letters
			if (spec == 'X') arg = arg.toUpperCase();
			// no result
			if (source == 0 && precision == 0) arg = '';
		}

		// 'u' specifier
		// writes unsigned integers
		if (spec == 'u') {
			if (typeof source != 'number') invalidArg();
			source = Math.round(source); // remove decimals

			// make arg string
			arg += source >>> 0;
			// padding
			if (!tok.leftAlign && tok.zeroPad) arg = arg.padStart(minFieldWidth, "0");
			// precision padding
			arg = arg.padStart(precision, "0");
			// no result
			if (source == 0 && precision == 0) arg = '';
		}

		// 'f' and 'F' specifier
		// writes floating point numbers
		if (spec == 'f' || spec == 'F') {
			if (typeof source != 'number') invalidArg();

			// if the arg is a positive number, add the sign or put a space
			// based on flags
			if (source >= 0) {
				if (tok.plusSign) arg += '+';
				else if (tok.spaceSign) arg += ' ';
			}

			// 'g'/'G' extension
			if (numberSpecifier && (!tok.alternate || (source % 1 === 0)))
				arg += source.toString().replace(new RegExp(`(\\d+(?:\\.\\d{${precision}}))\\d*`), "$1");
			// fixed precision
			else arg += source.toFixed(precision ?? 6);
			// alternate form: a dot even no digits follow it
			if (tok.alternate && precision == 0) arg += '.';
			// for 'g'/'G' specifier
			if (numberSpecifier && tok.alternate && !arg.includes('.')) arg += '.';
			// leading zeros
			if (!tok.leftAlign && tok.zeroPad) arg = arg.padStart(minFieldWidth, "0");
		}

		// 'e' and 'E' specifier
		// writes floating point numbers in scientific notation
		if (spec == 'e' || spec == 'E') {
			if (typeof source != 'number') invalidArg();

			// if the arg is a positive number, add the sign or put a space
			// based on flags
			if (source >= 0) {
				if (tok.plusSign) arg += '+';
				else if (tok.spaceSign) arg += ' ';
			}

			const magnitude = Math.floor(Math.log10(Math.abs(source)));
			const scale = source / (10 ** magnitude);

			// fixed precision
			let n = (source == 0 ? 0 : scale).toFixed(precision ?? 6);
			// 'g'/'G' extension
			if (numberSpecifier && !tok.alternate)
				n = n.replace(new RegExp(`(\\d+(?:\\.\\d{${precision}}))\\d*`), "$1")
					.replace(/(?<=\.\d*)0+$/, '')
					.replace(/\.$/, '');
			// leading zeros
			if (!tok.leftAlign && tok.zeroPad) n = n.padStart(minFieldWidth, "0");
			// alternate form
			if (tok.alternate && precision == 0) n += '.';
			arg += n + 'e';
			// the magnitude
			if (magnitude >= 0 || source == 0) arg += '+';
			else arg += '-';
			arg += source == 0 ? '0' : Math.abs(magnitude).toString().padStart(2, '0');
			// upper case
			if (spec == 'E') arg = arg.toUpperCase();
		}

		// 'a' and 'A' specifier
		// writes floating point numbers in *hexadecimal* scientific notation
		if (spec == 'a' || spec == 'A') {
			if (typeof source != 'number') invalidArg();

			// if the arg is a positive number, add the sign or put a space
			// based on flags
			if (source >= 0) {
				if (tok.plusSign) arg += '+';
				else if (tok.spaceSign) arg += ' ';
			}

			const magnitude = Math.floor((Math.log(Math.abs(source)) / Math.log(16)));
			const scale = source / (16 ** magnitude);

			// hex prefix
			arg += '0x';
			// fixed precision
			let n = scale.toString(16);
			// ensure precision is inline
			n = n.replace(
				new RegExp(`^([\\da-fA-F]+(?:\\.[\\da-fA-F]{${precision}}))[\\da-fA-F]*$`)
				, "$1").replace(/(?<=\.\d*)0+$/, '');
			if (source == 0) n = '0';
			// leading zeros
			if (!tok.leftAlign && tok.zeroPad) n = n.padStart(minFieldWidth, "0");
			// alternate form
			if (tok.alternate && precision == 0) n += '.';
			arg += n + 'p';
			// the magnitude
			if (magnitude >= 0 || source == 0) arg += '+';
			else arg += '-';
			arg += source == 0 ? '0' : Math.abs(magnitude).toString().padStart(1, '0');
			// upper case
			if (spec == 'A') arg = arg.toUpperCase();
		}

		// padding
		if (tok.leftAlign) arg = arg.padEnd(minFieldWidth, ' ');
		else arg = arg.padStart(minFieldWidth, ' ');

		// add this to final string
		txt += arg;

	}

	// the result
	return txt;
}

/**
 * formats a string
 * @param format the format string
 * @param args[] arguments to use for formatting
 * @returns the resulting string
 * @throws TypeError this can throw errors
 */
export function formatString(format: string, ...args: any[]): string {
	return applyFormat(parseFormat(format), ...args);
}

