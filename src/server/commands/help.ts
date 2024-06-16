import { makeCommand, cmdInfos, getCmdInfo } from "./index.js";
import { formatHelp, config } from "../../catalyst/index.js";
import { commandSub } from "../../catalyst/@types/commands";

const MAX_PAGE_SIZE = 10;

const info: commandSub = {
  name: "help",
  dest: "",
  help: "show help about commands",
  subs: [
    {
      name: "",
      dest: "pg",
      args: [
        {
          type: "int",
          name: "page",
          dest: "page",
          required: false,
          default: 1,
        }
      ]
    },
    {
      name: "",
      dest: "cmd",
      args: [
        {
          type: "string",
          name: "command",
          dest: "name",
          required: true,
        }
      ]
    }
  ]
};

makeCommand(info, (args, ev, plr) => {
  if (args.cmd) {
    // find the requested command
    const cmd = getCmdInfo(args.name);
    if (!cmd)
      throw `command not found: ${args.name}`;

    // construct the message
    let msg = `§ecommand ${cmd.name}§r\n`;
    if (cmd.aliases)
      msg += `§ealiases: ${cmd.aliases.join(', ')}§r\n`;
    if (cmd.help)
      msg += cmd.help;
    else
      msg += 'no description.';
    msg += '\n';

    // process command info
    for (const line of formatHelp(cmd).sort())
      msg += config.commandPrefix + line + '\n';

    plr.msg(msg);
    return;
  }

  // get all the cmd infos
  let list: string[] = [];
  for (const cmd of cmdInfos)
    list = [ ...list, ...formatHelp(cmd) ];
  list.sort();

  // some paging info
  const maxPage = Math.ceil(list.length / MAX_PAGE_SIZE);
  const page    = Math.min(args.page, maxPage) - 1;
  const start   = page < 0 ? 0 : page * MAX_PAGE_SIZE;
  const end     = page < 0 ? list.length : Math.min(start + MAX_PAGE_SIZE, list.length);

  // construct msg
  let msg;
  if (page < 0) msg = '§ashowing help to all commands§r\n';
  else msg = `§ashowing help page ${page + 1} of ${maxPage}§r\n`;

  // construct cmd infos
  for (let i = start; i < end; i++)
    msg += config.commandPrefix + list[i] + '\n';

  plr.msg(msg);
});

