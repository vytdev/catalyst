import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { setTickTimeout } from "../../catalyst/index.js";
import { kits } from "../index.js";
import { assertNotInCombat } from "../utils.js";
import { world } from "@minecraft/server";

const info: commandSub = {
  name: "kit",
  dest: "",
  help: "Get a kit.",
  args: [
    {
      name: "name",
      dest: "name",
      type: "string",
      required: true,
    }
  ]
};

makeCommand(info, (args, ev, plr) => {
  assertNotInCombat(plr);
  const kit = kits.find(v => v.name == args.name);

  // validate option
  if (!kit)
    throw `unknown kit '${args.name}'\n` +
      'options: ' + kits.map(v => v.name).join(', ');

  // give the kit
  setTickTimeout(() => {
    world.structureManager.place('kit:' + args.name,
                                 plr.player.dimension,
                                 plr.player.location);
    plr.msg(`§aGiven kit: §6${args.name}§r\n`);
  });
});

