import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { setTickTimeout } from "../../catalyst/index.js";
import { kits, ranks } from "../index.js";
import { assertNotInCombat } from "../utils.js";
import { world } from "@minecraft/server";

const info: commandSub = {
  name: "kit",
  dest: "",
  help: "get a kit",
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

  // admin kit..
  if (kit.admin && !plr.isAdmin)
    throw `kit '${args.name}' is only for admins`;

  if (kit.rank && plr.rank < kit.rank)
    throw `you need to get the '${ranks[kit.rank].name}§r§c' rank first to use this kit`;

  // give the kit
  setTickTimeout(() => {
    world.structureManager.place('kit:' + args.name,
                                 plr.player.dimension,
                                 plr.player.location);
    plr.msg(`§agiven kit: §6${args.name}§r\n`);
  });
});

