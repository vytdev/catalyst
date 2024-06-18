import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { config, vec3 } from "../../catalyst/index.js";
import { options } from "../index.js";
import { assertIsAdmin } from "../utils.js";

const info: commandSub = {
  name: "mloc",
  dest: "",
  help: "manage server locations",
  subs: [
    {
      name: "add",
      dest: "add",
      args: [
        {
          name: "id",
          dest: "id",
          type: "string",
          required: true,
        },
        {
          name: "pos",
          dest: "pos",
          type: "xyz",
        }
      ]
    },
    {
      name: "rm",
      dest: "rm",
      args: [
        {
          name: "id",
          dest: "id",
          type: "string",
          required: true,
        }
      ]
    }
  ]
};

makeCommand(info, (args, ev, plr) => {
  assertIsAdmin(plr);
  options.load();
  const locs = options.get('locs', {});

  if (args.add) {
    if (locs[args.id]) throw 'location is already set!';
    let xyz = args.pos ? args.pos(plr.loc, plr.rot) as vec3 : plr.loc;
    locs[args.id] = xyz;
    options.set('locs', locs);
    options.save();
    plr.msg('§alocation set: §6' + args.id);
    return;
  }

  if (args.rm) {
    if (!locs[args.id]) throw 'location not found!';
    locs[args.id] = undefined;
    options.set('locs', locs);
    options.save();
    plr.msg('§alocation removed: §6' + args.id);
    return;
  }

  plr.msg('§emanage server locations§r\n' +
          '§etype §b' + config.commandPrefix + 'help mloc§r§e for more info');
});

