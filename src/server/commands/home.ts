import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { config, vec3, vec2, setTickTimeout } from "../../catalyst/index.js";
import { assertNotInCombat } from "../utils.js";
import { world } from "@minecraft/server";

const info: commandSub = {
  name: "home",
  dest: "",
  aliases: [ "h" ],
  help: "manage your homes",
  subs: [
    {
      name: "add",
      dest: "add",
      aliases: [ "new", "set" ],
      args: [
        {
          name: "name",
          dest: "name",
          type: "string",
          required: true,
        }
      ]
    },

    {
      name: "delete",
      dest: "del",
      aliases: [ "del", "remove", "rm" ],
      args: [
        {
          name: "name",
          dest: "name",
          type: "string",
          required: true,
        }
      ]
    },

    {
      name: "teleport",
      dest: "tp",
      aliases: [ "tp" ],
      args: [
        {
          name: "name",
          dest: "name",
          type: "string",
          required: true,
        }
      ]
    },
  ]
};

makeCommand(info, (args, ev, plr) => {
  assertNotInCombat(plr);

  plr.db.load();
  let homes: [
    string, // name
    string, // dimension
    vec3,   // position
    vec2,   // head rotation
  ][] = plr.db.get('homes') ?? [];

  // add new home
  if (args.add) {
    // home already exists
    if (homes.some(v => v[0] == args.name))
      throw 'home name already exists!';

    // add and update the table
    homes.push([
      args.name,
      plr.player.dimension.id,
      plr.player.location,
      plr.player.getRotation(),
    ]);

    plr.db.set('homes', homes);
    plr.db.save();
    plr.msg('§anew home set: §6' + args.name);
    return;
  }

  // delete a home
  if (args.del) {
    // home does not exist
    if (homes.every(v => v[0] != args.name))
      throw 'home not found!';

    // remove the home name (including any possible duplicates, if any)
    homes = homes.filter(v => v[0] != args.name);

    plr.db.set('homes', homes);
    plr.db.save();
    plr.msg('§adeleted home: §6' + args.name);
    return;
  }

  // tp to a home
  if (args.tp) {
    // get the home
    const home = homes.find(v => v[0] == args.name);

    // home not found
    if (!home)
      throw 'home not found!';

    // queue teleport
    setTickTimeout(() => {
      plr.player.teleport(home[2], {
        dimension: world.getDimension(home[1]),
        rotation: home[3],
      });
      plr.msg('§ateleported to home: §6' + args.name);
    });
    return;
  }

  // list homes

  // home list is empty
  if (!homes.length) {
    plr.msg(
      '§eyou have no home set\n' +
      '§euse §b' + config.commandPrefix + 'home add§r§e to set homes'
    );
    return;
  }

  // show the list
  let msg = '§eyou have §6' + homes.length + '§e homes:§r\n';
  msg += homes.map(h => '- §b' + h[0] + '§r (' +
                   '§7' + Math.floor(h[2].x) + '§r, ' +
                   '§7' + Math.floor(h[2].y) + '§r, ' +
                   '§7' + Math.floor(h[2].z) + '§r ' +
                   'at §7' + h[1].replace('minecraft:', '') +
                   '§r)').join('\n');
  plr.msg(msg);
});

