import { world } from "@minecraft/server";
import { registerCommand, Database } from "../../catalyst/index.js";
import { getClientByName, Client } from "../client.js";
import { colorize } from "../utils.js";

registerCommand({
	name: "db",
	help: "Manage databases",
}, (argv, ev) => {
	if (!ev) throw "api!";
	const sargv = argv.map(v => v.text);

	// help
	if (!argv[1] || sargv[1] == "help") {
		ev.sender.sendMessage("§eManage databases!");
		ev.sender.sendMessage("§e\\db help - show this help");
		ev.sender.sendMessage("§e\\db set <subject> <id> <key> <value>");
		ev.sender.sendMessage("§e\\db get <subject> <id> <key>");
		ev.sender.sendMessage("§e\\db del <subject> <id> <key>");
		ev.sender.sendMessage("§e\\db clear <subject> <id>");
		ev.sender.sendMessage("§e\\db show <subject> <id>");
		ev.sender.sendMessage("§e\\db create <subject> <id>");
		ev.sender.sendMessage("§e\\db destroy <subject> <id>");
		return;
	}

	if (![ 'set', 'get', 'del', 'clear', 'show', 'create', 'destroy' ].includes(sargv[1])) throw "Unknown sub-command: " + sargv[1];

	if (!sargv[3]) throw "Too few arguments!";

	// get database host
	const subject = sargv[2] == "world" ? world : getClientByName(sargv[2]);
	if (!subject) throw `Player with name '${sargv[2]}' not found!`;
	const id = sargv[3];
	// the database
	const db = subject instanceof Client ? subject.db : new Database(id, subject);
	if (sargv[1] != 'create') db.load();
	else ev.sender.sendMessage('§aDatabase has been created! ' + db);

	// set
	if (sargv[1] == 'set') {
		const key = sargv[4];
		if (!key) throw "key not given";
		const val = sargv[5];
		if (!val) throw "value not given";

		let json: any;
		try {
			json = JSON.parse(val);
		} catch {
			throw "failed to parse value!";
		}

		db.set(key, json);
		ev.sender.sendMessage('§aKey has been set!');
	}

	// get
	if (sargv[1] == 'get') {
		const key = sargv[4];
		if (!key) throw "key not given";

		ev.sender.sendMessage(colorize(db.get(key)));
		return;
	}

	// del
	if (sargv[1] == 'del') {
		const key = sargv[4];
		if (!key) throw "key not given";

		if (db.del(key)) ev.sender.sendMessage('§aKey has been deleted!');
		else ev.sender.sendMessage('§cFailed to delete key!');
	}

	// clear
	if (sargv[1] == 'clear') {
		db.clear();
		ev.sender.sendMessage('§aDatabase has been cleared!')
	}

	// show
	if (sargv[1] == 'show') {
		ev.sender.sendMessage(colorize(db['_cache']));
		return;
	}

	// destroy
	if (sargv[1] == 'destroy') {
		db.destroy();
		ev.sender.sendMessage('§aDatabase has been destroyed!');
		return;
	}

	db.save();
});
