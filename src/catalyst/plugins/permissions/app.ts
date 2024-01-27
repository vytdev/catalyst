import { Player } from "@minecraft/server";
import * as core from "../../index.js";
const plugin = new core.Plugin("permissions", function(require, module, exports) {

/**
 * get permissions of player
 * @param plr the player instance
 * @returns array of strings of player permissions
 */
function getPermissions(plr: Player): string[] {
	const result: string[] = [];

	plr.getTags()?.forEach(v => {
		if (!v.startsWith("permission.")) return;
		result.push(v.slice("permission.".length));
	});

	return result;
}

/**
 * check for player permission
 * @param plr the player
 * @param perm the permission
 * @returns true when player has this permission
 */
function hasPermission(plr: Player, perm: string): boolean {
	return getPermissions(plr).includes(perm);
}

/**
 * check if player has atleast one of given permissions
 * @param plr the player
 * @param perms[] the permissions
 * @throws when player dont have permission
 */
function assertHasPermission(plr: Player, ...perms: string[]): void {
	if (!perms.some(perm => hasPermission(plr, perm)))
		throw "You have no permission!";
}

/**
 * grant a permission to a player
 * @param plr the player
 * @param perm the permission
 */
function grantPermission(plr: Player, perm: string): void {
	plr.addTag("permission." + perm);
}

/**
 * remove a permission from the player
 * @param plr the player
 * @param perm the permission
 */
function revokePermission(plr: Player, perm: string): void {
	plr.removeTag("permission." + perm);
}

// expose functions
module.exports = {
	getPermissions,
	hasPermission,
	assertHasPermission,
	grantPermission,
	revokePermission,
};

});
