/**
 * bedrock server management helpers
 */

import { world, system, Player, CommandResult, Entity, Dimension } from "@minecraft/server";
import config from "../config.js";
import { events } from "./index.js";
import { formats } from "./format.js";

/**
 * broadcast a message to the world, or to specific player(s)
 * @param msg the message
 * @param [color] color of the exclamation mark
 * @param [target] player(s)
 */
export function broadcast(msg: string, color?: string, target?: Player | Player[]): void {
	let txt = "";
	// §6[<color>§l!§r§6]§r
	txt += formats.dark_gray + "[" + (color || formats.yellow) + formats.bold +
		"!" + formats.reset + formats.dark_gray + "]" + formats.reset + " ";
	// the message
	txt += msg;

	// broadcast
	if (target instanceof Player) target.sendMessage(txt);
	else if (target instanceof Array) target.forEach(plr => plr.sendMessage(txt));
	else world.sendMessage(txt);
}

/**
 * send a message to players, while still allowing players to hide the message
 * using the "Mute" option
 * @param msg the message
 * @param [target] player(s)
 */
export function message(msg: string, target?: Player | Player[]): void {
	// [/tellraw] command
	const cmd = `tellraw @s {"rawtext":[{"text":${JSON.stringify(msg)}}]}`;
	// run command
	if (target instanceof Player) queueCommand(cmd, target);
	else if (target instanceof Array) target.forEach(plr => queueCommand(cmd, plr));
	else world.getAllPlayers()?.forEach(plr => queueCommand(cmd, plr));
}

// command queue
const cmdQueue: Function[] = [];
// flush the command queue
system.runInterval(() => {
	// initial value for buffer
	let buffer = config.commandBuffer;
	// loop
	while (cmdQueue.length && buffer-- > 0)
		cmdQueue.shift()?.();
});

/**
 * queue a minecraft command
 * @param cmd the command
 * @param [target] the target
 * @returns a promise which later can be resolved
 */
export function queueCommand(cmd: string, target?: Entity | Dimension): Promise<CommandResult> {
	return new Promise<CommandResult>(resolve => cmdQueue.push(resolve))
		.then(r => runCommand(cmd, target));
}

/**
 * run a minecraft command
 * @param cmd the command
 * @param [target] the target
 * @returns the command result
 */
export function runCommand(cmd: string, target?: Entity | Dimension): CommandResult {
	return (target ?? world.getDimension("overworld")).runCommand(cmd);
}

// listen for internal events
world.beforeEvents.chatSend.subscribe(ev => events.dispatchEvent("beforeChatSend", ev));
world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe(ev => events.dispatchEvent("beforeDataDrivenEntityTriggerEvent", ev));
world.beforeEvents.effectAdd.subscribe(ev => events.dispatchEvent("beforeEffectAdd", ev));
world.beforeEvents.entityRemove.subscribe(ev => events.dispatchEvent("beforeEntityRemove", ev));
world.beforeEvents.explosion.subscribe(ev => events.dispatchEvent("beforeExplosion", ev));
world.beforeEvents.itemDefinitionEvent.subscribe(ev => events.dispatchEvent("beforeItemDefinitionEvent", ev));
world.beforeEvents.itemUse.subscribe(ev => events.dispatchEvent("beforeItemUse", ev));
world.beforeEvents.itemUseOn.subscribe(ev => events.dispatchEvent("beforeItemUseOn", ev));
world.beforeEvents.pistonActivate.subscribe(ev => events.dispatchEvent("beforePistonActivate", ev));
world.beforeEvents.playerBreakBlock.subscribe(ev => events.dispatchEvent("beforePlayerBreakBlock", ev));
world.beforeEvents.playerInteractWithBlock.subscribe(ev => events.dispatchEvent("beforePlayerInteractWithBlock", ev));
world.beforeEvents.playerInteractWithEntity.subscribe(ev => events.dispatchEvent("beforePlayerInteractWithEntity", ev));
world.beforeEvents.playerLeave.subscribe(ev => events.dispatchEvent("beforePlayerLeave", ev));
world.beforeEvents.playerPlaceBlock.subscribe(ev => events.dispatchEvent("beforePlayerPlaceBlock", ev));
world.afterEvents.blockExplode.subscribe(ev => events.dispatchEvent("afterBlockExplode", ev));
world.afterEvents.buttonPush.subscribe(ev => events.dispatchEvent("afterButtonPush", ev));
world.afterEvents.chatSend.subscribe(ev => events.dispatchEvent("afterChatSend", ev));
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => events.dispatchEvent("afterDataDrivenEntityTriggerEvent", ev));
world.afterEvents.effectAdd.subscribe(ev => events.dispatchEvent("afterEffectAdd", ev));
world.afterEvents.entityDie.subscribe(ev => events.dispatchEvent("afterEntityDie", ev));
world.afterEvents.entityHealthChanged.subscribe(ev => events.dispatchEvent("afterEntityHealthChanged", ev));
world.afterEvents.entityHitBlock.subscribe(ev => events.dispatchEvent("afterEntityHitBlock", ev));
world.afterEvents.entityHitEntity.subscribe(ev => events.dispatchEvent("afterEntityHitEntity", ev));
world.afterEvents.entityHurt.subscribe(ev => events.dispatchEvent("afterEntityHurt", ev));
world.afterEvents.entityLoad.subscribe(ev => events.dispatchEvent("afterEntityLoad", ev));
world.afterEvents.entityRemove.subscribe(ev => events.dispatchEvent("afterEntityRemove", ev));
world.afterEvents.entitySpawn.subscribe(ev => events.dispatchEvent("afterEntitySpawn", ev));
world.afterEvents.explosion.subscribe(ev => events.dispatchEvent("afterExplosion", ev));
world.afterEvents.itemCompleteUse.subscribe(ev => events.dispatchEvent("afterItemCompleteUse", ev));
world.afterEvents.itemDefinitionEvent.subscribe(ev => events.dispatchEvent("afterItemDefinitionEvent", ev));
world.afterEvents.itemReleaseUse.subscribe(ev => events.dispatchEvent("afterItemReleaseUse", ev));
world.afterEvents.itemStartUse.subscribe(ev => events.dispatchEvent("afterItemStartUse", ev));
world.afterEvents.itemStartUseOn.subscribe(ev => events.dispatchEvent("afterItemStartUseOn", ev));
world.afterEvents.itemStopUse.subscribe(ev => events.dispatchEvent("afterItemStopUse", ev));
world.afterEvents.itemStopUseOn.subscribe(ev => events.dispatchEvent("afterItemStopUseOn", ev));
world.afterEvents.itemUse.subscribe(ev => events.dispatchEvent("afterItemUse", ev));
world.afterEvents.itemUseOn.subscribe(ev => events.dispatchEvent("afterItemUseOn", ev));
world.afterEvents.leverAction.subscribe(ev => events.dispatchEvent("afterLeverAction", ev));
world.afterEvents.messageReceive.subscribe(ev => events.dispatchEvent("afterMessageReceive", ev));
world.afterEvents.pistonActivate.subscribe(ev => events.dispatchEvent("afterPistonActivate", ev));
world.afterEvents.playerBreakBlock.subscribe(ev => events.dispatchEvent("afterPlayerBreakBlock", ev));
world.afterEvents.playerDimensionChange.subscribe(ev => events.dispatchEvent("afterPlayerDimensionChange", ev));
world.afterEvents.playerInteractWithBlock.subscribe(ev => events.dispatchEvent("afterPlayerInteractWithBlock", ev));
world.afterEvents.playerInteractWithEntity.subscribe(ev => events.dispatchEvent("afterPlayerInteractWithEntity", ev));
world.afterEvents.playerJoin.subscribe(ev => events.dispatchEvent("afterPlayerJoin", ev));
world.afterEvents.playerLeave.subscribe(ev => events.dispatchEvent("afterPlayerLeave", ev));
world.afterEvents.playerPlaceBlock.subscribe(ev => events.dispatchEvent("afterPlayerPlaceBlock", ev));
world.afterEvents.playerSpawn.subscribe(ev => events.dispatchEvent("afterPlayerSpawn", ev));
world.afterEvents.pressurePlatePop.subscribe(ev => events.dispatchEvent("afterPressurePlatePop", ev));
world.afterEvents.pressurePlatePush.subscribe(ev => events.dispatchEvent("afterPressurePlatePush", ev));
world.afterEvents.projectileHitBlock.subscribe(ev => events.dispatchEvent("afterProjectileHitBlock", ev));
world.afterEvents.projectileHitEntity.subscribe(ev => events.dispatchEvent("afterProjectileHitEntity", ev));
world.afterEvents.targetBlockHit.subscribe(ev => events.dispatchEvent("afterTargetBlockHit", ev));
world.afterEvents.tripWireTrip.subscribe(ev => events.dispatchEvent("afterTripWireTrip", ev));
world.afterEvents.weatherChange.subscribe(ev => events.dispatchEvent("afterWeatherChange", ev));
world.afterEvents.worldInitialize.subscribe(ev => events.dispatchEvent("afterWorldInitialize", ev));
system.beforeEvents.watchdogTerminate.subscribe(ev => events.dispatchEvent("beforeWatchdogTerminate", ev));
system.afterEvents.scriptEventReceive.subscribe(ev => events.dispatchEvent("afterScriptEventReceive", ev));
