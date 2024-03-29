import * as core from "../../index.js";
const plugin = new core.Plugin("utilities", function(require, module, exports) {

// require some plugins
const permissions = require("permissions");

// whether the chats is enabled
let chatsEnabled = true;

// \chat - toggles the chat
const cmd_chat = core.registerCommand({
	name: "chat",
	help: "Toggles the chat",
}, (argv, ev) => {
	// check permission
	permissions.assertHasPermission(ev.sender, core.config.adminPerm);

	// toggle chats
	chatsEnabled = !chatsEnabled;

	// make broadcast
	let msg = "";
	msg += core.formats.yellow + "Chat has been ";
	// ... the state
	if (chatsEnabled) msg += core.formats.green + "enabled";
	else msg += core.formats.red + "disabled";
	msg += core.formats.yellow;
	// ... the name of admin
	if (ev?.sender) msg += " by " + core.formats.gold + ev.sender.name;
	// broadcast
	core.broadcast(msg);
});

// \broadcast - broadcasts message
const cmd_broadcast = core.registerCommand({
	name: "broadcast",
	aliases: [ "b" ],
	help: "Broadcast a message to server",
}, (argv, ev) => {
	// check permission
	permissions.assertHasPermission(ev.sender, core.config.adminPerm);

	// broadcast message
	core.broadcast(argv.slice(1).map(v => v.text).join(" "), core.formats.aqua);
});

// block messages when chat is disabled
const listener_beforeChatSend = core.events.on("beforeChatSend", ev => {
	// a custom command, end here
	if (ev.message.startsWith(core.config.commandPrefix)) return;

	// block messages when chat is disabled
	if (!chatsEnabled && !permissions.hasPermission(ev.sender, core.config.adminPerm)) {
		ev.cancel = true;
		core.broadcast(core.formats.red + "Chat is currently disabled!", null, ev.sender);
	}
});

// unload plugin
module.once("pluginUnload", ev => {
	core.deregisterCommand(cmd_chat.name);
	core.deregisterCommand(cmd_broadcast.name);
	core.events.off(listener_beforeChatSend);
});

});
