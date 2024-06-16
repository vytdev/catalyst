import { makeCommand } from "./index.js";
import { world } from "@minecraft/server";
import { Database } from "../../catalyst/index.js";
import { getClientByName, Client } from "../client.js";
import { colorize, assertIsAdmin } from "../utils.js";
import config from "../../catalyst/config.js"

makeCommand({
  name: "data",
  dest: "",
  aliases: [ "db" ],
  help: "manage databases",

  args: [
    { dest: "subject", type: "string", required: true },
    { dest: "id",      type: "string", required: true },
  ],

  subs: [
    {
      name: "set",
      dest: "set",
      args: [
        { dest: "key",     type: "string", required: true },
        { dest: "value",   type: "string", required: true },
      ],
    },
    {
      name: "get",
      dest: "get",
      args: [
        { dest: "key",     type: "string", required: true },
      ],
    },
    {
      name: "del",
      dest: "del",
      args: [
        { dest: "key",     type: "string", required: true },
      ],
    },
    {
      name: "clear",
      dest: "clear",
    },
    {
      name: "show",
      dest: "show",
    },
    {
      name: "create",
      dest: "create",
    },
    {
      name: "destroy",
      dest: "destroy",
    },
  ]
}, (args, ev, plr) => {
  assertIsAdmin(plr);

  // help
  if ([
    "set", "get", "del", "clear", "show", "create", "destroy"
  ].every(v => !args[v])) {
    plr.msg(`§eplease enter action command!`);
    plr.msg(`§etype §b${config.commandPrefix}help data§r§e for more info`);
    return;
  }

  // get database host
  const subject = args.subject == 'world'
    ? world
    : getClientByName(args.subject);
  if (!subject)
    throw `player with name '${args.subject}' not found!`;

  // the database
  const db = new Database(args.id, subject instanceof Client
    ? subject.player
    : subject);
  if (!args.create)
    db.load();
  else
    plr.msg('§adatabase has been created! ' + db);

  // set
  if (args.set) {
    let json: any;
    try {
      json = JSON.parse(args.value);
    } catch {
      throw "failed to parse value!";
    }

    db.set(args.key, json);
    plr.msg('§akey has been set!');
  }

  // get
  if (args.get) {
    plr.msg(colorize(db.get(args.key)));
    return;
  }

  // del
  if (args.del) {
    if (db.del(args.key)) plr.msg('§akey has been deleted!');
    else plr.msg('§cfailed to delete key!');
  }

  // clear
  if (args.clear) {
    db.clear();
    plr.msg('§adatabase has been cleared!')
  }

  // show
  if (args.show) {
    plr.msg(colorize(db['_cache']));
    return;
  }

  // destroy
  if (args.destroy) {
    db.destroy();
    plr.msg('§adatabase has been destroyed!');
    return;
  }

  db.save();
});

