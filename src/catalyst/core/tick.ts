/**
 * minecraft tick utilities
 */

import { system } from "@minecraft/server";

/**
 * sleep for your asynchronous functions, in tick scale
 * @param [ticks] the tick delay
 * @returns Promise which should be resolved after certain ticks
 */
export function sleep(ticks: number = 0): Promise<void> {
	return new Promise<void>(resolve => system.runTimeout(resolve, ticks));
}
