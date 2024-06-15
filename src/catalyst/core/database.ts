/**
 * dynamic property database
 */

import { World, Entity, ItemStack, world } from "@minecraft/server";

/**
 * @class Database
 * database manager class
 */
export class Database<T extends Record<string, any>> {
  /**
   * the database size limit (in bytes)
   */
  public static readonly maxSize: number = 32767;

  /**
   * @constructor
   * initialize a new instance of this class
   * @param id the database identifier
   * @param [host] the database host, can be either world, an item stack, or
   * an entity world by default
   */
  constructor(id: string, host: World | Entity | ItemStack = world) {
    this.id = "db:" + id;
    this.host = host;
  }

  /**
   * the id of database
   */
  public readonly id: string;
  /**
   * the database host
   */
  public readonly host: World | Entity | ItemStack;

  /**
   * load the database from the host
   * @returns the database, or undefined if database is not set
   * @throws this can throw errors
   */
  public load(): T | undefined {
    const raw = this.host.getDynamicProperty(this.id);
    // database not set
    if (typeof raw == "undefined") return;
    // not a string
    if (typeof raw != "string") throw new Error("Invalid format!");
    // serialize data
    const json: T = JSON.parse(raw);
    // set as cache
    this._cache = json;
    // return the json
    return json;
  }

  /**
   * save the database into host
   * @throws this can throw errors
   */
  public save(): void {
    const json = JSON.stringify(this._cache);
    // serialization failed
    if (!json) throw new Error("Store failed!");
    // database overflowing
    if (json.length > Database.maxSize) throw new Error("Database overflow!");
    // store databse
    this.host.setDynamicProperty(this.id, json);
  }

  /**
   * delete the database from the host, cache is left intact
   */
  public destroy(): void {
    this.host.setDynamicProperty(this.id);
  }

  /**
   * @private
   */
  private _cache: T = {} as T;

  /**
   * set a value for a key
   * @param key the key
   * @param val valur to assign
   * @returns self
   */
  public set<K extends keyof T>(key: K, val: T[K]): this {
    this._cache[key] = val;
    return this;
  }

  /**
   * retrieve a set value from a key
   * @param key the key
   * @param def default value if not found
   * @returns the value
   */
  public get<K extends keyof T, D extends any>(key: K, def?: D): T[K] | D {
    return this._cache[key] ?? def;
  }

  /**
   * checks for existence of a key
   * @param key the key
   * @returns true if key is found
   */
  public has<K extends keyof T>(key: K): boolean {
    return typeof this._cache[key] != "undefined";
  }

  /**
   * remove a key
   * @param key the key
   * @returns true if key existed and has been removed
   */
  public del<K extends keyof T>(key: K): boolean {
    return delete this._cache[key];
  }

  /**
   * clears the cache, use Database.save() to take changes
   */
  public clear(): void {
    this._cache = {} as T;
  }

  /**
   * returns string representation of the database
   * @returns string
   */
  toString(): string {
    let host = this.host instanceof Entity
      ? this.host.id
      : this.host instanceof ItemStack
        ? "itemStack"
        : "world";
    return `Database[${this.id} @ ${host}]`;
  }

}

