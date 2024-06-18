/**
 * in-game selectors
 */
import {
  Dimension,
  Entity,
  GameMode,
  EntityQueryOptions,
  EntityQueryScoreOptions,
  Vector3
} from "@minecraft/server";

const enum SelectorSpecifier {
  allPlayers    = 'a',
  nearestPlayer = 'p',
  randomPlayer  = 'r',
  yourSelf      = 's',
  allEntities   = 'e',
}

/*
type c x y z dx dy dz r rm scores name tag family rxm rx rym ry lm l mode items
*/

export class Selector implements EntityQueryOptions {
  excludeFamilies:       string[]        = [];
  excludeGameModes:      GameMode[]      = [];
  excludeNames:          string[]        = [];
  excludeTags:           string[]        = [];
  excludeTypes:          string[]        = [];
  families:              string[]        = [];
  gameMode:              GameMode        = null;
  maxHorizontalRotation: number          = null;
  maxVerticalRotation:   number          = null;
  minHorizontalRotation: number          = null;
  minVerticalRotation:   number          = null;
  maxLevel:              number          = null;
  minLevel:              number          = null;
  name:                  string          = null;
  scoreOptions:          EntityQueryScoreOptions[] = [];
  tags:                  string[]        = [];
  type:                  string          = null;
  closest:               number          = null;
  farthest:              number          = null;
  maxDistance:           number          = null;
  minDistance:           number          = null;
  volume:                Vector3         = { x: null, y: null, z: null };
  location:              Vector3         = { x: null, y: null, z: null };

  selector:  string            = '@e';
  specifier: SelectorSpecifier = null;

  /**
   * create a Selector class from given EntityQueryOptions object
   * @param opt the EntityQueryOptions object
   * @returns {Selector} the output
   */
  public static from(opt: EntityQueryOptions): Selector {
    const cls = new Selector();
    cls.excludeFamilies         = opt.excludeFamilies || [];
    cls.excludeGameModes        = opt.excludeGameModes || [];
    cls.excludeNames            = opt.excludeNames || [];
    cls.excludeTags             = opt.excludeTags || [];
    cls.excludeTypes            = opt.excludeTypes || [];
    cls.families                = opt.families || [];
    cls.gameMode                = opt.gameMode;
    cls.maxHorizontalRotation   = opt.maxHorizontalRotation;
    cls.maxVerticalRotation     = opt.maxVerticalRotation;
    cls.minHorizontalRotation   = opt.minHorizontalRotation;
    cls.minVerticalRotation     = opt.minVerticalRotation;
    cls.maxLevel                = opt.maxLevel;
    cls.minLevel                = opt.minLevel;
    cls.name                    = opt.name;
    cls.scoreOptions            = opt.scoreOptions || [];
    cls.tags                    = opt.tags || [];
    cls.type                    = opt.type;
    cls.closest                 = opt.closest;
    cls.farthest                = opt.farthest;
    cls.maxDistance             = opt.maxDistance;
    cls.minDistance             = opt.minDistance;
    cls.volume                  = opt.volume;
    cls.location                = opt.location;
    return cls;
  }

  /**
   * @constructor
   * creates a new Selector class
   * @param sel player name or selector specifier
   * @throws this can throw errors
   */
  constructor(sel?: string) {
    if (!sel)
      return;

    // player name
    if (sel[0] != '@') {
      this.selector = sel;
      return;
    }

    // check the specifier
    if (!'aeprs'.includes(sel[1]))
      throw 'invalid selector specifier: ' + sel[1];

    // set this specifier
    this.specifier = sel[1] as SelectorSpecifier;

    // TODO: selector parser
  }

  /**
   * returns a string representation of this selector
   * @returns {string} the string
   */
  toString(): string {
    let str = this.selector;
    if (str[0] != '@')
      return str;

    // options
    const options = [];
    this.excludeFamilies.forEach(v => options.push('family=!' + v));
    this.families.forEach(v => options.push('family=' + v));
    this.excludeGameModes.forEach(v => options.push('mode=!' + v));
    this.excludeNames.forEach(v => options.push('name=!' + v));
    this.excludeTags.forEach(v => options.push('tag=!' + v));
    this.tags.forEach(v => options.push('tag=' + v));
    this.excludeTypes.forEach(v => options.push('type=!' + v));
    if (this.gameMode != null) options.push('mode=' + this.gameMode);
    if (this.name != null) options.push('name=' + this.name);
    if (this.type != null) options.push('type=' + this.type);
    if (this.maxHorizontalRotation != null) options.push('rx=' + this.maxHorizontalRotation);
    if (this.maxVerticalRotation != null) options.push('ry=' + this.maxVerticalRotation);
    if (this.minHorizontalRotation != null) options.push('rxm=' + this.minHorizontalRotation);
    if (this.minVerticalRotation != null) options.push('rym=' + this.minVerticalRotation);
    if (this.maxLevel != null) options.push('l=' + this.maxLevel);
    if (this.minLevel) options.push('lm=' + this.minLevel);
    if (this.closest != null) options.push('c=' + this.closest);
    if (this.farthest != null) options.push('c=-' + this.farthest);
    if (this.maxDistance != null) options.push('r=' + this.maxDistance);
    if (this.minDistance != null) options.push('rm=' + this.minDistance);
    if (this.volume.x != null) options.push('dx=' + this.volume.x);
    if (this.volume.y != null) options.push('dy=' + this.volume.y);
    if (this.volume.z != null) options.push('dz=' + this.volume.z);
    if (this.location.x != null) options.push('x=' + this.location.x);
    if (this.location.y != null) options.push('y=' + this.location.y);
    if (this.location.z != null) options.push('z=' + this.location.z);

    const scores = this.scoreOptions.map(v => {
      let str = v.objective + "=";
      if (v.exclude) str += "!";

      if (typeof v.maxScore == 'number' || typeof v.minScore == 'number') {
        // absolute value
        if (v.maxScore == v.minScore)
          str += v.maxScore;
        // range
        else {
          if (typeof v.minScore == 'number')
            str += v.minScore;
          str += '..';
          if (typeof v.maxScore == 'number')
            str += v.maxScore;
        }
      }
    });

    if (scores.length) options.push('scores={' + scores.join(',') + '}');
    if (options.length) str += '[' + options.join(',') + ']';
    return str;
  }

  /**
   * execute a search for this selector on a dimension
   * @param src the dimension where to search this entity or the source entitty
   */
  public search(src: Dimension | Entity): Entity[] {
    const dim = src instanceof Dimension ? src : src.dimension;

    // setup query
    const q = Selector.from(this);
    if (src instanceof Entity) {
      q.location.x = this.location.x ?? src.location.x;
      q.location.y = this.location.y ?? src.location.y;
      q.location.z = this.location.z ?? src.location.z;
    }

    // player specifier
    if (this.specifier == SelectorSpecifier.allPlayers ||
        this.specifier == SelectorSpecifier.nearestPlayer ||
        this.specifier == SelectorSpecifier.randomPlayer)
      q.type = 'minecraft:player';

    // @s specifier
    if (this.specifier == SelectorSpecifier.yourSelf)
      return src instanceof Dimension ? [] : src.matches(q)
          ? [src]
          : [];

    // find entities on the dimension
    return dim.getEntities(q);
  }
}

