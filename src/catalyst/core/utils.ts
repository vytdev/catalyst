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

/**
 * convert number into roman numeral
 * @param n the number
 * @returns result string
 */
export function toRomanNumeral(num: number): string {
  // NOTES:
  // - no negative
  // - no decimals
  // - no zeros

  // num is higher than the representable roman number
  if (num > 3999) return num.toString();

  // in minecraft, unicode diacritic `\u0305` (macron) may not display
  // correctly, better to not add them

  // i used recursion because its easy to debug :)
  if(num >= 1000) return 'M'  + toRomanNumeral(num - 1000);
  if(num >=  900) return 'CM' + toRomanNumeral(num - 900);
  if(num >=  500) return 'D'  + toRomanNumeral(num - 500);
  if(num >=  400) return 'CD' + toRomanNumeral(num - 400);
  if(num >=  100) return 'C'  + toRomanNumeral(num - 100);
  if(num >=   90) return 'XC' + toRomanNumeral(num - 90);
  if(num >=   50) return 'L'  + toRomanNumeral(num - 50);
  if(num >=   40) return 'XL' + toRomanNumeral(num - 40);
  if(num >=   10) return 'X'  + toRomanNumeral(num - 10);
  if(num >=    9) return 'IX' + toRomanNumeral(num - 9);
  if(num >=    5) return 'V'  + toRomanNumeral(num - 5);
  if(num >=    4) return 'IV' + toRomanNumeral(num - 4);
  if(num >=    1) return 'I'  + toRomanNumeral(num - 1);

  return '';
}

/**
 * escape regular expression in strings
 * @param string the string
 * @returns {string}
 */
export function escapeRegExp(str: string): string {
  // thx: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

/**
 * a regex for validating urls. useful for whether filtering urls on chats, or just
 * highlighting them automatically. e-mails can match by this regex too! it is good for
 * general purpose, but it is not fully compliant to rfc 3986 (i just need this regex
 * for the game)
 *
 * explanation:
 *
 * scheme
 * (?:[\w\d-]+:\/\/)?
 *
 * username
 * (?:[\w\d+_\.~-]+@)?
 *
 * host (dns and ipv4 part)
 * (?:(?:[\w\d_-]+\.)+[\w\d_-]+|
 *
 * host (ipv6 part)
 * \[[0-9a-fA-F:]+\])
 *
 * port
 * (?::\d+)?
 *
 * start of path
 * (?:\/
 *
 * dirs
 * (?:[^\s\/$.?#]+\/)*
 *
 * file
 * [^\s\/$.?#]*
 *
 * query (?a=b&c=d)
 * (?:\?(?:[^\s\/$.?#=]+\=[^\s\/$.?#=]+)+(?:&[^\s\/$.?#=]+=[^\s\/$.?#=]+)*)?
 *
 * fragment
 * (?:#[^\s\/$.?#]*)?
 *
 * end of path
 * )?
 *
 * @author me (vytdev)
 */
export const urlRegex = /(?:[\w\d-]+:\/\/)?(?:[\w\d+_\.~-]+@)?(?:(?:[\w\d_-]+\.)+[\w\d_-]+|\[[0-9a-fA-F:]+\])(?::\d+)?(?:\/(?:[^\s\/$.?#]+\/)*[^\s\/$.?#]*(?:\?(?:[^\s\/$.?#=]+\=[^\s\/$.?#=]+)+(?:&[^\s\/$.?#=]+=[^\s\/$.?#=]+)*)?(?:#[^\s\/$.?#]*)?)?/gi;

