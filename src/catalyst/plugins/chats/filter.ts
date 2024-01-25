import profanity from "./profanity.js";

/**
 * convert profanity word into regex
 * @param prof the word
 * @returns RegExp
 */
export function toRegex(prof: string): RegExp {
	let regex = prof;

	// mask variations for every letters
	regex = regex.replace(/./g, m => { switch(m.toLowerCase()) {
		case "a": return "[*aA@4]";
		case "b": return "[*bB8]";
		case "c": return "[*cC()<>{}\\[\\]]";
		case "d": return "[*dD]";
		case "e": return "[*eE3]";
		case "f": return "[*fF#]";
		case "g": return "[*gG9]";
		case "h": return "[*hH#]";
		case "i": return "[*iI!1]";
		case "j": return "[*jJ]";
		case "k": return "[*kK]";
		case "l": return "[*lL1|]";
		case "m": return "[*mM]";
		case "n": return "[*nN]";
		case "o": return "[*oO0]";
		case "p": return "[*pPq]";
		case "q": return "[*qQp]";
		case "r": return "[*rR]";
		case "s": return "[*sS$5zZ2]";
		case "t": return "[*tT+]";
		case "u": return "[*uUvV]";
		case "v": return "[*vVuU]";
		case "w": return "[*wW]";
		case "x": return "[*xX]";
		case "y": return "[*yY]";
		case "z": return "[*zZ2sS$5]";
		default: return m;
	}});

	// return regexp: ignorecase and global flag
	return new RegExp(regex, "ig");
}

/**
 * filter all the profanity word
 * @param msg the text
 * @returns tbe result
 */
export function clean(msg: string): string {
	let out = msg;

	// replace profanity words
	profanity.forEach(v => out = out.replace(
		toRegex(v), // convert word to regex for better matching
		m => "*".repeat(m.length) // replace with stars
	));

	return out;
}
