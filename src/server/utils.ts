// some utility...
import { Client } from "./client.js";
import { Player } from "@minecraft/server";

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

/**
 * assert that player is an admin
 */
export function assertIsAdmin(plr: Client) {
  if (!plr.isAdmin)
    throw 'You have no permission to execute this command!';
}

/**
 * assert player is not in combat mode unless they are admin
 */
export function assertNotInCombat(plr: Client) {
  if (plr.combatTag && !plr.isAdmin)
    throw 'You cannot do this action while in combat mode!';
}

/**
 * returns whether a player is an admin
 * @param plr the player
 * @returns {boolean} the result
 */
export function isPlayerAdmin(plr: Player): boolean {
  return !!plr.getDynamicProperty('admin');
}

/**
 * set a player admin or not
 * @param plr the player
 * @param val value
 */
export function setPlayerAdmin(plr: Player, val: boolean): void {
  plr.setDynamicProperty('admin', val);
}

