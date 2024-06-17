import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { setTickTimeout } from "../../catalyst/index.js";
import { showShop } from "../shop.js";
import { assertNotInCombat } from "../utils.js";

const info: commandSub = {
  name: "shop",
  dest: "",
  help: "open shop",
};

makeCommand(info, (args, ev, plr) => {
  assertNotInCombat(plr);

  // show the shop form
  setTickTimeout(() => {
    showShop(plr);
    plr.msg('§eplease close the chat box');
  });
});

