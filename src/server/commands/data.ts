import { makeCommand } from "./index.js";
import { world } from "@minecraft/server";
import { Database } from "../../catalyst/index.js";
import { getClientByName, Client } from "../client.js";
import { colorize } from "../utils.js";
import config from "../../catalyst/config.js"

makeCommand({
  name: "db",
  dest: "",
  help: "Manage databases",
  subs: [
    {
      name: "help",
      dest: "help",
    },
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
}, (args, ev) => {
  if (!ev) throw "api!";

  // help
  if (args['help'] || [
    "set", "get","del", "clear", "show", "create", "destroy"
  ].every(v => !args[v])) {
    ev.sender.sendMessage("§eManage databases!");
    ev.sender.sendMessage("§e\\db help - show this help");
    ev.sender.sendMessage("§e\\db set <subject> <id> <key> <value>");
    ev.sender.sendMessage("§e\\db get <subject> <id> <key>");
    ev.sender.sendMessage("§e\\db del <subject> <id> <key>");
    ev.sender.sendMessage("§e\\db clear <subject> <id>");
    ev.sender.sendMessage("§e\\db show <subject> <id>");
    ev.sender.sendMessage("§e\\db create <subject> <id>");
    ev.sender.sendMessage("§e\\db destroy <subject> <id>");
    return;
  }

  if (!ev.sender.hasTag(config.adminPerm))
    throw "You have no permission to execute this command!";

  // get database host
  const subject = args['subject'] == 'world' ? world : getClientByName(args['subject']);
  if (!subject) throw `Player with name '${args['subject']}' not found!`;
  const id = args['id'];
  // the database
  const db = subject instanceof Client ? subject.db : new Database(id, subject);
  if (!args['create']) db.load();
  else ev.sender.sendMessage('§aDatabase has been created! ' + db);

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
    ev.sender.sendMessage('§aKey has been set!');
  }

  // get
  if (args['get']) {
    const key = args['key'];
    if (!key) throw "key not given";

    ev.sender.sendMessage(colorize(db.get(key)));
    return;
  }

  // del
  if (args['del']) {
    const key = args['key'];
    if (!key) throw "key not given";

    if (db.del(key)) ev.sender.sendMessage('§aKey has been deleted!');
    else ev.sender.sendMessage('§cFailed to delete key!');
  }

  // clear
  if (args['clear']) {
    db.clear();
    ev.sender.sendMessage('§aDatabase has been cleared!')
  }

  // show
  if (args['show']) {
    ev.sender.sendMessage(colorize(db['_cache']));
    return;
  }

  // destroy
  if (args['destroy']) {
    db.destroy();
    ev.sender.sendMessage('§aDatabase has been destroyed!');
    return;
  }

  db.save();
});

