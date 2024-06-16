import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { setTickTimeout } from "../../catalyst/index.js";
import { serverLocs } from "../index.js";
import { assertNotInCombat } from "../utils.js";

const info: commandSub = {
  name: "warp",
  dest: "",
  help: "Warp into a server location.",
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

  // validate option
  if (!serverLocs.has(args.loc))
    throw `unknown location '${args.loc}'\n` +
      'options: ' + [...serverLocs.keys()].join(', ');

  // tp the player
  setTickTimeout(() => {
    plr.player.teleport(serverLocs.get(args.loc));
    plr.msg(`§aYou have been teleported to: §6${args.loc}§r\n`);
  });
});

