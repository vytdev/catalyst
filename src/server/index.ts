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
 * combat tag time (in ticks)
 */
export const combatTime = 20 * 15; // 15 seconds

/**
 * server locations (used in \warp)
 */
export const serverLocs: Map<string, vec3> = new Map([
  ['spawn', { x: 0, y: 7, z: 0 }],
]);

import "./client.js";
import "./commands/index.js";
