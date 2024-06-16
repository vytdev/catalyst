import { makeCommand } from "./index.js";
import { config, broadcast } from "../../catalyst/index.js";
import { commandSub } from "../../catalyst/@types/commands";
import { ownerName, controlPassword } from "../index.js";
import { getClientByName } from "../client.js";

const info: commandSub = {
  name: "perm",
  dest: "",
  help: "utility for control of admin permissions",
  subs: [
    {
      name: "login",
      dest: "login",
      args: [
        {
          name: "password",
          dest: "password",
          type: "string",
          required: true,
        }
      ]
    },
    {
      name: "logout",
      dest: "logout",
    },
    {
      name: "revoke",
      dest: "revoke",
      args: [
        {
          name: "player",
          dest: "player",
          type: "string",
          required: true,
        }
      ]
    }
  ]
};

makeCommand(info, (args, ev, plr) => {

  // login request
  if (args.login) {
    // player is already admin
    if (plr.isAdmin)
      throw "§eno need! you're already an admin";

    // check password
    if (args.password != controlPassword)
      throw "incorrect password. permission denied!";

    // password is correct!
    plr.isAdmin = true;
    plr.msg("§eyou have been granted admin priviledges");
    broadcast(`§6${plr.name}§r§e have accessed admin priviledges`);
    return;
  }

  // logout request
  if (args.logout) {
    // player is not an admin
    if (!plr.isAdmin)
      throw "you are not an administrator!";

    // revoke permissions
    plr.isAdmin = false;
    plr.msg("§eyou have revoked your admin priviledges")
    broadcast(`§6${plr.name}§r§e have revoked its admin priviledges`);
    return;
  }

  // owner revocation
  if (args.revoke) {
    // player is not the owner
    if (plr.name != ownerName)
      throw "you are not the server owner!";

    // find player by name
    const client = getClientByName(args.player);
    if (!client)
      throw "the player either do not exist or is offline";

    // the player is not an adnin
    if (!client.isAdmin)
      throw "the player is not an admin";

    client.isAdmin = false;
    plr.msg(`§eyou have successfuly revoked §6${args.player}§r§e's admin priviledges`);
    client.msg("§ethe owner have revoked your admin priviledges");
    broadcast(`§ethe owner have revoked §6${args.player}§r§e's admin priviledges`);
    return;
  }

  // no action provided
  plr.msg(
    "§emanage administration permissions\n" +
    "§eplease enter an action command\n" +
    "§etype §b" + config.commandPrefix + "help perm§r§e for more information"
  );
});

