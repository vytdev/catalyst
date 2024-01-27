/**
 * a simple plugin registry system
 */

import { EventManager } from "./events.js";
import { events } from "./index.js";

const registry: Map<string, Plugin> = new Map();
type exportsType = Record<string, any>;

/**
 * loads a plugin
 * @param id the identifier of the plugin
 * @returns the exported objects of the plugin
 */
export function loadPlugin(id: string): exportsType {
	if (!registry.has(id)) throw new ReferenceError(`Plugin "${id}" not found`);
	const plg = registry.get(id);

	// load the plugin
	if (!plg.isActive) {
		plg.isActive = true;
		plg.exports = {};
		// run the plugin
		plg.fn.call(plg, loadPlugin, plg, plg.exports);
		// fire pluginLoaded event on global scope
		events.dispatchEvent("pluginLoaded", plg);
	}

	// return exports
	return plg.exports;
}

/**
 * unloads a plugin
 * @param id the identifier of the plugin
 */
export function unloadPlugin(id: string): void {
	if (!registry.has(id)) return;
	const plg = registry.get(id);
	plg.isActive = false;
	plg.exports = {};

	// trigger the pluginUnload, so the plugin can do some post cleanup
	plg.dispatchEvent("pluginUnload", plg);

	// trigger the pluginUnloaded event on global scope
	events.dispatchEvent("pluginUnloaded", plg);
}

// plugin events
type pluginEvents = {
	"pluginUnload": [Plugin]
};

/**
 * @class Plugin
 * plugin class
 */
export class Plugin extends EventManager<pluginEvents> {
	/**
	 * @constructor
	 * make a new plugin
	 * @param id the identifier of the plugin
	 * @param fn the startup function of the plugin
	 */
	constructor(
		public readonly id: string,
		public readonly fn: (this: Plugin, require: typeof loadPlugin, module: Plugin, exports: exportsType) => void
	) {
		super();
		registry.set(id, this);
		// trigger pluginRegistered event on global scope
		events.dispatchEvent("pluginRegistered", this);
	}

	/**
	 * exported objects of the plugin
	 */
	public exports: exportsType;

	/**
	 * whether the plugin is currently active
	 */
	public isActive: boolean = false;
}
