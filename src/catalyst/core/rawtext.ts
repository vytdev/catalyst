/**
 * rawtext builder
 */

/**
 * rawText structure
 */
interface rawText {
	/**
	 * rawtext
	 */
	rawtext: rawTextNode[],
}

interface textRawMessage {
	/**
	 * raw string
	 */
	text: string,
}

interface translateRawMessage {
	/**
	 * translation key
	 */
	translate: string,

	/**
	 * arguments for translation
	 */
	with?: rawText | string[] | RawText,
}

interface selectorRawMessage {
	/**
	 * target selector
	 */
	selector: string,
}

interface scoreRawMessage {
	/**
	 * scoreboard score
	 */
	score: {

		/**
		 * target selector of entity to get the score
		 */
		name: string,

		/**
		 * name of objective
		 */
		objective: string,
	},
}

type rawTextNode = textRawMessage | translateRawMessage | selectorRawMessage | scoreRawMessage;

/**
 * @class RawText
 * the rawtext builder class
 */
export class RawText {
	/**
	 * @constructor
	 * creates a new RawText instance
	 * @param [nodes] optional raw json nodes
	 */
	constructor(nodes: rawTextNode[] = []) {
		this._nodes = nodes;
	}

	/**
	 * rawtext nodes
	 * @private
	 */
	private _nodes: rawTextNode[] = [];

	/**
	 * raw string
	 * @param val the string
	 * @param [prepend] put this on top of the rawtext
	 * @returns self
	 */
	public text(val: string, prepend?: boolean): this {
		const json = { text: val };
		if (prepend) this.prepend(json);
		else this.append(json);
		return this;
	}

	/**
	 * translate message from player's locale
	 * @param key the translation key
	 * @param [prepend] put this on top of the rawtext
	 * @returns self
	 */
	public translate(key: string, prepend?: boolean): this {
		const json = { translate: key };
		if (prepend) this.prepend(json);
		else this.append(json);
		return this;
	}

	/**
	 * add a translation argument
	 * @param rawtext RawText instance as tbe argument
	 * @param str array of string as the arguments
	 * @returns self
	 */
	public with(rawtext: RawText): this;
	public with(...str: string[]): this;
	public with(...args: any[]): this {
		const node = this._nodes[this._nodes.length - 1];
		if (node && "translate" in node)
			node.with = args[0] instanceof RawText
				? args[0]
				: node.with instanceof Array
					? node.with.concat(args)
					: args;
		return this;
	}

	/**
	 * target selector
	 * @param val '@-' target selector or player name
	 * @param [prepend] put this on top of the rawtext
	 * @returns self
	 */
	public selector(val: string, prepend?: boolean): this {
		const json = { selector: val };
		if (prepend) this.prepend(json);
		else this.append(json);
		return this;
	}

	/**
	 * scorboard score of entity
	 * @param objective the scoreboard objective
	 * @param name target selector
	 * @param [prepend] put this on top of the rawtext
	 * @returns self
	 */
	public score(objective: string, name: string, prepend?: boolean): this {
		const json = {score:{ objective, name }};
		if (prepend) this.prepend(json);
		else this.append(json);
		return this;
	}

	/**
	 * inserts a raw node at the end of the rawtext
	 * @param node the raw json object node
	 * @returns self
	 */
	public append(node: rawTextNode): this {
		this._nodes.push(node);
		return this;
	}

	/**
	 * inserts a raw node at the start of the rawtext
	 * @param node the raw json object node
	 * @returns self
	 */
	public prepend(node: rawTextNode): this {
		this._nodes.unshift(node);
		return this;
	}

	/**
	 * convert to raw json object
	 * @returns rawText object
	 */
	toJSON(): rawText {
		return {
			// rawtext field
			rawtext: this._nodes.map(v => {
				// with field sometimes a RawText instance
				if ("with" in v && v.with instanceof RawText)
					return { translate: v.translate, with: v.with.toJSON() };
				// no need for further modification
				return v;
			})
		}
	}

	/**
	 * returns json text
	 * @returns the string
	 */
	toString(): string {
		return JSON.stringify(this.toJSON());
	}
}
