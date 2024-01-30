/**
 * entry point of catalyst
 */

import { system, world } from "@minecraft/server";
import { EventManager } from "./events.js";
import { defaultEvents } from "../@types/types";
import config from "../config.js";

/**
 * default event manager
 */
export const events = new EventManager<defaultEvents>();

/**
 * the version of catalyst core
 */
export const VERSION = "0.2.0-beta.1";

// preload and export modules
export * from "./command.js";
export * from "./database.js";
export * from "./events.js";
export * from "./format.js";
export * from "./forms.js";
export * from "./glyphs.js";
export * from "./logger.js";
export * from "./math.js";
export * from "./plugin.js";
export * from "./rawtext.js";
export * from "./selector.js";
export * from "./server.js";
export * from "./thread.js";
export * from "./tick.js";
export * from "./utils.js";


// monitor the world tick
let lastTick = Date.now();
/**
 * how long was the last tick were taken to execute (in ms)
 */
export let tickDeltaTime = 0;
/**
 * the current ticks per second of the server
 */
export let currentTps = 20;

// loop for monitoring the server tick
system.runInterval(() => {
	// update the tickDeltaTime and currentTps variable
	const currTick = Date.now();
	tickDeltaTime = currTick - lastTick;
	lastTick = currTick;
	currentTps = 1000 / tickDeltaTime;

	if (tickDeltaTime >= config.serverLagWarning)
		console.warn(`Running ${tickDeltaTime}ms behind, skipping ${tickDeltaTime / 50} tick(s).`);
});

// prevent watchdog from closing the server
system.beforeEvents.watchdogTerminate.subscribe(ev => {
	ev.cancel = true;
	console.error("Watchdog: " + ev.terminateReason);
});