import { system, world } from "@minecraft/server";
import * as core from "../../index.js";
const plugin = new core.Plugin("speedometer", function(require, module, exports) {

// list of players (their id) that use speedometer
const players: string[] = [];
// global database to preserve the state of speedometer
const db = new core.Database(module.id);
// update 'players' variable based on last state
db.load()?.['list']?.forEach?.((v: string) => players.push(v));

// register command
const cmd = core.registerCommand("speedometer", (argv, ev) => {
	// command called from core.callCommand()
	if (!ev) throw "Not available on API!";
	// player
	const player = ev.sender;

	// get the next state of the speedometer
	const toggle = !players.includes(player.id);
	let state;

	// toggle speedometer
	if (toggle) {
		state = core.formats.green + "enabled";
		players.push(player.id);
	} else {
		state = core.formats.red + "disabled";
		players.splice(players.indexOf(player.id), 1);
	}

	// update database
	db.set('list', players);
	try {
		db.save();
	} catch { /* no-op */ }

	player.sendMessage(`${core.formats.yellow}Speedometer has been ${state}`);
}, [ "spdm" ]);

// loop per tick
const loop = system.runInterval(() => {
	world.getAllPlayers()?.forEach(plr => {
		// skip player
		if (!players.includes(plr.id) && !plr.isGliding) return;

		const velocity = plr.getVelocity();
		const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
		// kilometers per hour (rounded to the first decimal place)
		// 720 might seem to be a magic number, but its just derived from:
		// speed * 720 = speed * 72000 / 1000 * 10
		// where:
		// - 72000 = ticks per real-time hour (20 * 60 * 60)
		// - 1000  = 1 in-game kilometer
		// - 10    = just for precision before rounding
		const speedKPH = Math.round(speed * 720) / 10;
		// show speed
		plr.onScreenDisplay.setActionBar("§6Speed: §e" + speedKPH + " km/h");
	});
});

// run when the plugin is unloaded
module.once("pluginUnload", ev => {
	core.deregisterCommand(cmd.name);
	system.clearRun(loop);
});

});
