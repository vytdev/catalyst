import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";

const info: commandSub = {
  name: "clear",
  dest: "",
  aliases: [ "clr" ],
  help: "clears your chat box by printing empty lines",
  args: [
    {
      name: "lineCount",
      dest: "lines",
      type: "int",
      default: 100,
    }
  ]
};

makeCommand(info, (args, ev, plr) => {
  let msg = "";

  // setup message
  for (let i = 0; i < args.lines; i++)
    msg += '\n';

  msg += '§achats has been cleared!';
  plr.msg(msg);
});

