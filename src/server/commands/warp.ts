import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { setTickTimeout } from "../../catalyst/index.js";
import { options } from "../index.js";
import { assertNotInCombat } from "../utils.js";

const info: commandSub = {
  name: "warp",
  dest: "",
  help: "warp into a server location",
  aliases: [ "w" ],
  args: [
    {
      name: "loc",
      dest: "loc",
      type: "string",
      required: true,
    }
  ]
};

makeCommand(info, (args, ev, plr) => {
  assertNotInCombat(plr);
  options.load();
  const locs = options.get('locs', {});

  // validate option
  if (!locs[args.loc])
    throw `unknown location '${args.loc}'\n` +
      'options: ' + [...Object.keys(locs)].join(', ');

  // tp the player
  setTickTimeout(() => {
    plr.player.teleport(locs[args.loc]);
    plr.msg(`§ayou have been teleported to: §6${args.loc}§r\n`);
  });
});

