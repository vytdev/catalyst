/**
 * SMP server code (sample)
 */
import { Logger } from "../catalyst/index.js";

export const logger = new Logger();

/**
 * the name of smp
 */
export const smpName = "Infinity";

/**
 * combat tag time (in ticks)
 */
export const combatTime = 20 * 15; // 15 seconds

import "./client.js";
import "./commands/index.js";
