// some utility...

/**
 * colorize json objects
 * @param v json value
 * @returns string result
 */
export function colorize(v: any): string {
	if (typeof v == 'boolean') return '§r§6' + v;
	if (typeof v == 'number') return '§r§b' + v;
	if (typeof v == 'string') return '§r§e' + JSON.stringify(v);
	if (v == null) return '§r§cnull';
	if (Array.isArray(v)) return '§r§8[' + v.map(colorize).join('§r§7,')  + '§r§8]';
	if (typeof v == 'object') return '§r§7{' + Object.entries(v).map(([k, v]) => colorize(k) + '§r§7:' + colorize(v)).join('§r§7,') + '§r§7}';
	return `§r§8${v}`;
}
