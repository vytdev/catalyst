import { makeCommand } from "./index.js";
import { world } from "@minecraft/server";
import { Database } from "../../catalyst/index.js";
import { getClientByName, Client } from "../client.js";
import { colorize, assertIsAdmin } from "../utils.js";
import config from "../../catalyst/config.js"

makeCommand({
  name: "db",
  dest: "",
  help: "Manage databases",
  subs: [
    {
      name: "set",
      dest: "set",
      args: [
        { dest: "subject", type: "string", required: true },
        { dest: "id",      type: "string", required: true },
        { dest: "key",     type: "string", required: true },
        { dest: "value",   type: "string", required: true },
      ],
    },
    {
      name: "get",
      dest: "get",
      args: [
        { dest: "subject", type: "string", required: true },
        { dest: "id",      type: "string", required: true },
        { dest: "key",     type: "string", required: true },
      ],
    },
    {
      name: "del",
      dest: "del",
      args: [
        { dest: "subject", type: "string", required: true },
        { dest: "id",      type: "string", required: true },
        { dest: "key",     type: "string", required: true },
      ],
    },
    {
      name: "clear",
      dest: "clear",
      args: [
        { dest: "subject", type: "string", required: true },
        { dest: "id",      type: "string", required: true },
      ],
    },
    {
      name: "show",
      dest: "show",
      args: [
        { dest: "subject", type: "string", required: true },
        { dest: "id",      type: "string", required: true },
      ],
    },
    {
      name: "create",
      dest: "create",
      args: [
        { dest: "subject", type: "string", required: true },
        { dest: "id",      type: "string", required: true },
      ],
    },
    {
      name: "destroy",
      dest: "destroy",
      args: [
        { dest: "subject", type: "string", required: true },
        { dest: "id",      type: "string", required: true },
      ],
    },
  ]
}, (args, ev, plr) => {
  if (!ev) throw "api!";

  assertIsAdmin(plr);

  // help
  if ([
    "set", "get","del", "clear", "show", "create", "destroy"
  ].every(v => !args[v])) {
    plr.msg(`§ePlease enter action command!`);
    plr.msg(`§eType ${config.commandPrefix}help for more info.`);
    return;
  }

  // get database host
  const subject = args['subject'] == 'world' ? world : getClientByName(args['subject']);
  if (!subject) throw `Player with name '${args['subject']}' not found!`;
  const id = args['id'];
  // the database
  const db = subject instanceof Client ? subject.db : new Database(id, subject);
  if (!args['create']) db.load();
  else plr.msg('§aDatabase has been created! ' + db);

  // set
  if (args['set']) {
    const key = args['key'];
    if (!key) throw "key not given";
    const val = args['value'];
    if (!val) throw "value not given";

    let json: any;
    try {
      json = JSON.parse(val);
    } catch {
      throw "failed to parse value!";
    }

    db.set(key, json);
    plr.msg('§aKey has been set!');
  }

  // get
  if (args['get']) {
    const key = args['key'];
    if (!key) throw "key not given";

    plr.msg(colorize(db.get(key)));
    return;
  }

  // del
  if (args['del']) {
    const key = args['key'];
    if (!key) throw "key not given";

    if (db.del(key)) plr.msg('§aKey has been deleted!');
    else plr.msg('§cFailed to delete key!');
  }

  // clear
  if (args['clear']) {
    db.clear();
    plr.msg('§aDatabase has been cleared!')
  }

  // show
  if (args['show']) {
    plr.msg(colorize(db['_cache']));
    return;
  }

  // destroy
  if (args['destroy']) {
    db.destroy();
    plr.msg('§aDatabase has been destroyed!');
    return;
  }

  db.save();
});

