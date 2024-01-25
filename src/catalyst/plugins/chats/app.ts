import { clean } from "./filter.js";
import core, { config as coreCfg } from "../../index.js";
const plugin = new core.Plugin("chats", function(require, module, exports) {

const listener_beforeChatSend = core.events.on("beforeChatSend", ev => {
	// a custom command
	if (ev.message.startsWith(coreCfg.commandPrefix)) return;
	// cancel broadcast
	ev.cancel = true;

	let msg = core.formats.notosans + core.formats.gray + ev.sender.name + core.formats.reset + ": ";

	// the actual message, masked profanity, removed format codes
	msg += core.removeFormatCodes(clean(ev.message));

	// [pos] placeholder
	msg = msg.replace(/\[pos\]/g, core.formats.aqua + "World:" + core.formats.reset +
		" " + ev.sender.dimension.id.replace("minecraft:", "") +
		" " + core.formats.yellow + "X:" + core.formats.reset + Math.floor(ev.sender.location.x) +
		" " + core.formats.yellow + "Y:" + core.formats.reset + Math.floor(ev.sender.location.y) +
		" " + core.formats.yellow + "Z:" + core.formats.reset + Math.floor(ev.sender.location.z));

	// [\ command ] placeholder
	msg = msg.replace(new RegExp(`\\[\\${coreCfg.commandPrefix}([^\\]]+)\\]`, "g"),
		(_, cmd) => core.formats.aqua + "[" + core.formats.yellow +
			coreCfg.commandPrefix + cmd + core.formats.aqua + "]" +
			core.formats.reset);

	// broadcast the message through [/tellraw]
	core.message(msg);
});

module.once("pluginUnload", () => {
	core.events.off(listener_beforeChatSend);
});

});
