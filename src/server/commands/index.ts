/**
 * command registry wrapper
 */

import {
  registerCommand,
  parseCommand,
  registerCommandTypeParser,
} from "../../catalyst/index.js";
import { commandSub, parseResult } from "../../catalyst/@types/commands";
import { ChatSendBeforeEvent } from "@minecraft/server";

type customCallback = (args: parseResult, ev: ChatSendBeforeEvent) => void;

export function makeCommand(data: commandSub, callback: customCallback): string {
  registerCommand({
    name: data.name,
    aliases: data.aliases,
    help: data.help,
  }, (argv, ev) => {
    callback(parseCommand(data, ev.message, argv), ev);
  });

  return data.name;
}

// import commands
import "./data.js";

