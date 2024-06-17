/**
 * SMP server code (sample)
 */
import { Logger, vec3 } from "../catalyst/index.js";

export const logger = new Logger();

/**
 * the name of smp
 */
export const smpName = "Infinity";

/**
 * time interval per permission validation (in ticks)
 */
export const validationInterval = 20 * 5; // 5 seconds

/**
 * the name of the owner
 */
export const ownerName = "vytdev";

/**
 * password to access admin permission
 */
export const controlPassword = "hello_world";

/**
 * combat tag time (in ticks)
 */
export const combatTime = 20 * 15; // 15 seconds

/**
 * server locations (used in \warp)
 */
export const serverLocs: Map<string, vec3> = new Map([
  ['spawn', { x: 0, y: 7, z: 0 }],
]);

/**
 * ranks
 */
export const ranks: { name: string, price: number, benifits: string[] }[] = [
  { name: "none", price: 0, benifits: [ "default" ] }
];

/**
 * kit list
 */
export const kits: { name: string, rank?: number, admin?: boolean }[] = [
  { name: 'operator', admin: true },
];

import "./client.js";
import "./chats.js";
import "./commands/index.js";
import "./shop.js";

