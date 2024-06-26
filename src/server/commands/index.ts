/**
 * command registry wrapper
 */

import {
  registerCommand,
  parseCommand,
  registerCommandTypeParser,
} from "../../catalyst/index.js";
import { commandSub, parseResult } from "../../catalyst/@types/commands";
import { Client, getClientById } from "../client.js";
import { ChatSendBeforeEvent } from "@minecraft/server";

type customCallback = (args: parseResult, ev: ChatSendBeforeEvent, plr: Client) => void;

export const cmdInfos: commandSub[] = [];

/**
 * register a command
 * @param data command parsing rules
 * @param callback command dispatch function
 * @returns {string} the name of this command
 */
export function makeCommand(data: commandSub, callback: customCallback): string {
  registerCommand({
    name: data.name,
    aliases: data.aliases,
    help: data.help,
  }, (argv, ev) => {
    if (!ev) throw new ReferenceError("cannot run command");
    callback(parseCommand(data, ev.message, argv), ev, getClientById(ev.sender.id));
  });
  cmdInfos.push(data);
  return data.name;
}

/**
 * get a command info by name or alias
 * @param name the name or alias
 * @returns {commandSub} the command info
 */
export function getCmdInfo(name: string): commandSub {
  return cmdInfos.find(v => v.name == name || v.aliases?.includes(name));
}

// import commands
import("./chat.js");
import("./clear.js");
import("./data.js");
import("./help.js");
import("./home.js");
import("./kit.js");
import("./mloc.js");
import("./perm.js");
import("./shop.js");
import("./spawn.js");
import("./vanish.js");
import("./warp.js");

