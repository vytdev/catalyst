/**
 * in-game selectors
 */

/**
 * base selector
 */
export const enum BaseSelector {
	/**
	 * nearest player
	 */
	nearest = "@p",
	/**
	 * all players
	 */
	all = "@a",
	/**
	 * random player
	 */
	random = "@r",
	/**
	 * all entities
	 */
	entities = "@e",
	/**
	 * self (executor)
	 */
	self = "@s",
	/**
	 * npc dialogue initiator
	 */
	initiator = "@initiator",
}

type gamemodeType = 0 | 1 | 2 | "s" | "c" | "a" | "d" | "survival" | "creative"
	| "adventure" | "spectator" | "default";

type slotType = "slot.weapon.mainhand" | "slot.weapon.offhand" | "slot.armor.head"
	| "slot.armor.chest" | "slot.armor.legs" | "slot.armor.feet" | "slot.hotbar"
	| "slot.inventory" | "slot.enderchest" | "slot.saddle" | "slot.armor"
	| "slot.chest" | "slot.equippable";

/**
 * selector builder
 */
export class Selector {
	/**
	 * make a new selector builder
	 * @param [base] the base selector
	 */
	constructor(base: BaseSelector = BaseSelector.self) {
		this._base = base;
	}
	private _base: BaseSelector;

	private _type: string = null;
	private _typeNegated: string[] = [];
	/**
	 * put type, you can add multiple types only if its negated
	 * @param type the type
	 * @param [negate] negate the type
	 */
	public type(type: string, negate?: boolean): this {
		if (!negate) this._type = type;
		else this._typeNegated.push(type);
		return this;
	}

	private _count: number = null;
	/**
	 * number of entities, positive value selects closest entities, and negative
	 * selects farthest entities
	 * @param count number
	 * @returns self
	 */
	public count(count: number): this {
		this._count = count;
		return this;
	}

	private _x: number = null;
	private _xRel: boolean = null;
	private _y: number = null;
	private _yRel: boolean = null;
	private _z: number = null;
	private _zRel: boolean = null;
	/**
	 * change the selector's x coordinate for search starting point
	 * @param x the x coordinate
	 * @param [rel] use relative coordinates from the executor
	 * @returns self
	 */
	public x(x: number, rel?: boolean): this {
		this._x = x;
		this._xRel = rel;
		return this;
	}
	/**
	 * change the selector's y coordinate for search starting point
	 * @param y the y coordinate
	 * @param [rel] use relative coordinates from the executor
	 * @returns self
	 */
	public y(y: number, rel?: boolean): this {
		this._y = y;
		this._yRel = rel;
		return this;
	}
	/**
	 * change the selector's z coordinate for search starting point
	 * @param z the z coordinate
	 * @param [rel] use relative coordinates from the executor
	 * @returns self
	 */
	public z(z: number, rel?: boolean): this {
		this._z = z;
		this._zRel = rel;
		return this;
	}

	private _rm: number = null;
	private _r: number = null;
	/**
	 * minimum radius (in blocks) where to search from the selector's origin
	 * @param rad minimum radius
	 * @returns self
	 */
	public minRadius(rad: number): this {
		this._rm = rad;
		return this;
	}
	/**
	 * maximum radius (in blocks) where to search from the selector's origin
	 * @param rad maximum radius
	 * @returns self
	 */
	public maxRadius(rad: number): this {
		this._r = rad;
		return this;
	}

	private _dx: number = null;
	private _dy: number = null;
	private _dz: number = null;
	/**
	 * length of the rectangular cuboid to search for entities
	 * @param val length (x coordinate)
	 * @returns self
	 */
	public length(val: number): this {
		this._dx = val;
		return this;
	}
	/**
	 * height of the rectangular cuboid to search for entities
	 * @param val height (y coordinate)
	 * @returns self
	 */
	public height(val: number): this {
		this._dy = val;
		return this;
	}
	/**
	 * width of the rectangular cuboid to search for entities
	 * @param val width (z coordinate)
	 * @returns self
	 */
	public width(val: number): this {
		this._dz = val;
		return this;
	}

	private _scores: Record<string, number | [number | null, number | null]> = {};
	/**
	 * search for entities with specific score or range in a scoreboard
	 * objective
	 * @param objective the objective
	 * @param val value to search for, can be a number, or an array
	 */
	public scores(objective: string, val: number | [number | null, number | null]): this {
		this._scores[objective] = val;
		return this;
	}

	private _name: string = null;
	private _nameNegated: string[] = [];
	/**
	 * search for entities that does or doesn't have specific name
	 * @param name the name to search for
	 * @param [negate] entities should not have this name
	 * @returns self
	 */
	public name(name: string, negate?: boolean): this {
		if (!negate) this._name = name;
		else this._nameNegated.push(name);
		return this;
	}

	private _tag: string[] = [];
	private _tagNegated: string[] = [];
	/**
	 * search dor entities that does or doesn't have specific tags
	 * @param tag the tag to check
	 * @param [negate] entities should not have this tag
	 * @returns self
	 */
	public tag(tag: string, negate?: boolean): this {
		if (!negate) this._tag.push(tag);
		else this._tagNegated.push(tag);
		return this;
	}

	private _family: string[] = [];
	private _familyNegated: string[] = [];
	/**
	 * search for entities that does or doesn't have specific family
	 * @param family the family of entity to search
	 * @param [negate] entities should not have this family
	 * @returns self
	 */
	public family(family: string, negate?: boolean): this {
		if (!negate) this._family.push(family);
		else this._familyNegated.push(family);
		return this;
	}

	private _rxm: number = null;
	private _rx: number = null;
	private _rym: number = null;
	private _ry: number = null;
	/**
	 * minimum x (pitch) rotation value
	 * @param val the rotation value (in degrees)
	 * @returns self
	 */
	public minXrot(val: number): this {
		this._rxm = val;
		return this;
	}
	/**
	 * maximum x (pitch) rotation value
	 * @param val the rotation value (in degrees)
	 * @returns self
	 */
	public maxXrot(val: number): this {
		this._rx = val;
		return this;
	}
	/**
	 * minimum y (yaw) rotation value
	 * @param val the rotation value (in degrees)
	 * @returns self
	 */
	public minYrot(val: number): this {
		this._rym = val;
		return this;
	}
	/**
	 * maximum y (yaw) rotation value
	 * @param val the rotation value (in degrees)
	 * @returns self
	 */
	public maxYrot(val: number): this {
		this._ry = val;
		return this;
	}

	private _lm: number = null;
	private _l: number = null;
	/**
	 * minimum experience level
	 * @param val level value
	 * @returns self
	 */
	public minLvl(val: number): this {
		this._lm = val;
		return this;
	}
	/**
	 * maximum experience level
	 * @param val level value
	 * @returns self
	 */
	public maxLvl(val: number): this {
		this._l = val;
		return this;
	}

	private _mode: gamemodeType = null;
	/**
	 * search for players with specific game mode
	 * @param mode the game mode, can be: 0, 's', 'survival', 1, 'c',
	 * 'creative', 2, 'a', 'adventure', 'spectator', 'd', and 'default'
	 * @returns self
	 */
	public mode(mode: gamemodeType): this {
		this._mode = mode;
		return this;
	}

	private _items: {
		item: string,
		quantity?: number,
		data?: number,
		location?: slotType,
		slot?: number
	}[] = [];
	/**
	 * check for entities having specific item
	 * @param item the name of item
	 * @param [quantity] number of items
	 * @param [data] item data (MCPE-151920)
	 * @param [location] slot type
	 * @param [slot] slot index
	 * @returns self
	 */
	public item(
		item: string,
		quantity?: number,
		data?: number,
		location?: slotType,
		slot?: number
	): this {
		this._items.push({ item, quantity, data, location, slot });
		return this;
	}

	/**
	 * finalize the selector into string
	 * @returns selector text
	 */
	toString(): string {
		let txt: string = this._base;
		const args = [];
		// type
		if (this._type) args.push(`type=${this._type}`);
		this._typeNegated.forEach(v => args.push(`type=!${v}`));
		// count
		if (typeof this._count == "number") args.push(`c=${this._count}`);
		// pos
		if (typeof this._x == "number") args.push(`x=${this._xRel ? '~' : ''}${this._x}`);
		if (typeof this._y == "number") args.push(`y=${this._yRel ? '~' : ''}${this._y}`);
		if (typeof this._z == "number") args.push(`z=${this._zRel ? '~' : ''}${this._z}`);
		// radius
		if (typeof this._rm == "number") args.push(`rm=${this._rm}`);
		if (typeof this._r == "number") args.push(`r=${this._r}`);
		// volume
		if (typeof this._dx == "number") args.push(`dx=${this._dx}`);
		if (typeof this._dy == "number") args.push(`dy=${this._dy}`);
		if (typeof this._dz == "number") args.push(`dz=${this._dz}`);
		// scores
		const scores: string[] = [];
		Object.entries(this._scores).forEach(([k, v]) => {
			let f = "";
			// exact score
			if (typeof v == "number") f += v;
			// range
			if (Array.isArray(v)) {
				if (typeof v[0] == "number") f += v[0];
				f += "..";
				if (typeof v[1] == "number") f += v[1];
			}
			scores.push(`${k}=${f}`);
		});
		if (scores.length) args.push(`scores={${scores.join(",")}}`);
		// name
		if (this._name) args.push(`name=${this._name}`);
		this._nameNegated.forEach(v => args.push(`name=!${v}`));
		// tag
		this._tag.forEach(v => args.push(`tag=${v}`));
		this._tagNegated.forEach(v => args.push(`tag=!${v}`));
		// family
		this._family.forEach(v => args.push(`family=${v}`));
		this._familyNegated.forEach(v => args.push(`family=!${v}`));
		// rotation
		if (typeof this._rxm == "number") args.push(`rxm=${this._rxm}`);
		if (typeof this._rx == "number") args.push(`rx=${this._rx}`);
		if (typeof this._rym == "number") args.push(`rym=${this._rym}`);
		if (typeof this._ry == "number") args.push(`ry=${this._ry}`);
		// level
		if (typeof this._lm == "number") args.push(`lm=${this._lm}`);
		if (typeof this._l == "number") args.push(`l=${this._l}`);
		// gamemode
		if (this._mode != null) args.push(`m=${this._mode}`);
		// items
		const items: string[] = [];
		this._items.forEach(v => {
			const item = [];
			item.push(`item=${v.item}`);
			if (typeof v.quantity == "number") item.push(`quantity=${v.quantity}`);
			if (typeof v.data == "number") item.push(`data=${v.data}`);
			if (typeof v.location == "string") item.push(`location=${v.location}`);
			if (typeof v.slot == "number") item.push(`slot=${v.slot}`);
			items.push(`{${item.join(",")}}`);
		});
		if (items.length == 1) args.push(`hasitem=${items[0]}`);
		if (items.length > 1) args.push(`hasitem=[${items.join(",")}]`);
		// put args
		if (args.length) txt += `[${args.join(",")}]`;
		// result
		return txt;
	}
}
