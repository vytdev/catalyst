/**
 * custom commands
 */

import { ChatSendBeforeEvent, world } from "@minecraft/server";
import { events } from "./index.js";
import { formats } from "./format.js";
import config from "../config.js";

/**
 * the current command prefix
 */
export let commandPrefix: string = config.commandPrefix;

/**
 * change the command prefix
 * @param newPrefix new prefix
 */
export function setCommandPrefix(newPrefix: string): void {
	events.dispatchEvent("commandPrefixChanged", commandPrefix, newPrefix);
	commandPrefix = newPrefix;
}

export type commandCallback = (argv: commandToken[], ev: ChatSendBeforeEvent | null) => void;

export interface commandToken {
	text: string,
	start: number,
	end: number,
	quoted: boolean,
}

/**
 * command data
 */
export interface commandData {
	/**
	 * name of command
	 */
	name: string,

	/**
	 * command help
	 */
	help?: string,

	/**
	 * command aliases
	 */
	aliases?: string[],
}

export interface commandEntry extends commandData {
	callback: commandCallback,
}

/**
 * utility function to split the command into tokens
 * @param cmd the command string to tokenize
 * @param [startIndex] optional start index, useful when skipping prefix
 * @returns array of command tokens
 */
export function tokenizeCommand(cmd: string, startIndex?: number): commandToken[] {
	const result: commandToken[] = [];

	let text: string;
	let escapeChar = false;

	let i: number;
	let start: number;
	let isQuoted = false;

	const addVec = () => {
		if (!text || !text.length)
			return;
		result.push({
			text,
			start: start + (isQuoted ? -1 : 0),
			end: i + (isQuoted ? 1 : 0),
			quoted: isQuoted,
		});
		text = null;
		start = null;
	}

	// extract parts by characters
	for (i = startIndex || 0; i < cmd.length; i++) {
		if (!text) {
			start = i;
			text = "";
		}

		const char = cmd[i];

		// char is escaped
		if (escapeChar) {
			escapeChar = false;
			text += char;
			continue;
		}

		// backslash found
		if (char == "\\") {
			escapeChar = true;
			continue;
		}

		// double quote found
		if (char == "\"") {
			addVec();
			isQuoted = !isQuoted;
			continue;
		}

		// whitespace
		if (!isQuoted && /\s/.test(char)) {
			addVec();
			continue;
		}

		text += char;
	}

	if (text && text.length) addVec();

	return result;
}

// command registry
const registry: commandEntry[] = [];

/**
 * registers a new command
 * @param data command data
 * @param callback the function to execute when the command is called
 * @param [aliases] optional command aliases
 * @returns the command entry
 */
export function registerCommand(data: commandData, callback: commandCallback): commandEntry {
	const cmd = {
		name: data.name,
		help: data.help || "No description.",
		aliases: data.aliases ?? [],
		callback,
	};
	registry.push(cmd);
	events.dispatchEvent("commandRegistered", cmd);
	return cmd;
}

/**
 * remove a command from the registry
 * @param name the name of command to remove
 */
export function deregisterCommand(name: string): void {
	const idx = registry.findIndex(v => v.name == name);
	if (idx == -1) return;
	registry.splice(idx, 1);
	events.dispatchEvent("commandDeregistered", name);
}

/**
 * get a command from the registry
 * @param cmd the command name or alias
 * @returns commandEntry object
 */
export function getCommand(cmd: string): commandEntry {
	return registry.find(v => v.name == cmd || v.aliases?.includes(cmd));
}

/**
 * get the command registry
 * @returns an array of registered commands
 */
export function getAllCommands(): commandEntry[] {
	// we internally handle the registry
	return registry.map(v => ({ ...v }));
}

/**
 * calls a command
 * @param cmd the command text
 * @throws this can throw errors
 */
export function callCommand(cmd: string): void {
	// parse command
	const argv = tokenizeCommand(cmd);
	if (!argv.length) throw "Unknown command.";
	// find command entry
	const entry = getCommand(argv[0].text);
	if (!entry) throw "Unknown command.";
	// trigger event
	events.dispatchEvent("commandRun", argv, null);
	// run command
	entry.callback(argv, null);
}


// listen for chat events
world.beforeEvents.chatSend.subscribe(ev => {
	// check for prefix
	if (!ev.message.startsWith(commandPrefix)) return;
	// cancel broadcast
	ev.cancel = true;

	try {
		// parse the command
		const argv = tokenizeCommand(ev.message, commandPrefix.length);
		// no parsed arguments
		if (!argv.length) throw "Unknown command.";

		// find the command
		const entry = getCommand(argv[0].text);
		// the command doesn't exist
		if (!entry) throw "Unknown command.";

		// trigger event
		events.dispatchEvent("commandRun", argv, ev);

		// run the command
		entry.callback(argv, ev);
	} catch (e) {
		let msg: string = formats.red;

		msg += e;
		// Error instance
		if (e?.stack) msg += "\n" + e.stack;

		ev.sender.sendMessage(msg);
	}

});