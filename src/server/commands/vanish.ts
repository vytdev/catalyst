import { makeCommand } from "./index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { setTickTimeout,queueCommand, RawText } from "../../catalyst/index.js";
import { assertIsAdmin } from "../utils.js";

const info: commandSub = {
  name: "vanish",
  dest: "",
  help: "toggle your visibility",
  flags: [
    {
      long: "message",
      short: "m",
      dest: "msg",
    }
  ]
};

makeCommand(info, (args, ev, plr) => {
  assertIsAdmin(plr);

  // update and get the new vanish state
  const newState = plr.vanish = !plr.vanish;

  // vanish set
  if (newState) {
    const rawMsg = new RawText()
      .text('§e')
      .translate('multiplayer.player.left')
      .with(plr.name);
    if (args.msg)
      queueCommand('/tellraw @a ' + rawMsg);
    plr.msg('§ayou are now hidden');
    // src/server/client.ts: sets the player
    // invisible if the vanish flag is on,
    // every tick
  }

  // vanish unset
  else {
    const rawMsg = new RawText()
      .text('§e')
      .translate('multiplayer.player.joined')
      .with(plr.name);
    if (args.msg)
      queueCommand('/tellraw @a ' + rawMsg);
    plr.msg('§ayou are now visible');
    // remove invisibility effect to the player
    setTickTimeout(() => plr.player.removeEffect('invisibility'));
  }

});

