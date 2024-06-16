import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { broadcast } from "../../catalyst/index.js";
import { toggleChat } from "../chats.js";
import { assertIsAdmin } from "../utils.js";

const info: commandSub = {
  name: "chat",
  dest: "",
  help: "Toggle chats.",
  args: [
    {
      name: "val",
      dest: "val",
      type: "boolean",
      required: true,
    }
  ]
};

makeCommand(info, (args, ev, plr) => {
  assertIsAdmin(plr);

  // toggle
  toggleChat(args.val);
  broadcast(`§echats has been ${args.val ? '§aenabled' : '§cdisabled'}§e by §6${plr.name}§r`);
});

