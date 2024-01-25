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
 * the rawtext builder class
 */
export class RawText {
	/**
	 * rawtext nodes
	 * @private
	 */
	private _nodes: rawTextNode[] = [];

	/**
	 * raw string
	 * @param val the string
	 * @returns self
	 */
	public text(val: string): this {
		this._nodes.push({ text: val });
		return this;
	}

	/**
	 * translate message from player's locale
	 * @param key the translation key
	 * @returns self
	 */
	public translate(key: string): this {
		this._nodes.push({ translate: key });
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
	 * @returns self
	 */
	public selector(val: string): this {
		this._nodes.push({ selector: val });
		return this;
	}

	/**
	 * scorboard score of entity
	 * @param objective the scoreboard objective
	 * @param name target selector
	 * @returns self
	 */
	public score(objective: string, name: string): this {
		this._nodes.push({score:{ objective, name }});
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
}
