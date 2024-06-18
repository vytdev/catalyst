import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { config, setTickTimeout } from "../../catalyst/index.js";
import { options } from "../index.js";
import { assertNotInCombat } from "../utils.js";

const info: commandSub = {
  name: "spawn",
  dest: "",
  help: "tp to spawn",
};

makeCommand(info, (args, ev, plr) => {
  assertNotInCombat(plr);
  options.load();
  const locs = options.get('locs', {});

  if (!locs.spawn) {
    throw 'spawn location not found\n' +
          'if you\'re an admin, please set it using §b' +
          config.commandPrefix + 'mloc add spawn [pos]';
  }

  // tp the player
  setTickTimeout(() => {
    plr.player.teleport(locs.spawn);
    plr.msg('§ayou have been teleported to: §6spawn§r\n');
  });
});

