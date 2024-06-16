import {
  events,
  config,
  removeFormatCodes,
  message,
  broadcast,
} from "../catalyst/index.js";
import profanity from "./profanity.js";

let isChatEnabled = true;
export function toggleChat(val: boolean) {
  isChatEnabled = val;
}

events.on("beforeChatSend", ev => {
  // a custom command
  if (ev.message.startsWith(config.commandPrefix)) return;
  // event already canceled
  if (ev.cancel) return;
  // cancel broadcast
  ev.cancel = true;

  if (!isChatEnabled && !ev.sender.hasTag(config.adminPerm)) {
    broadcast('§echat is currently disabled!§r', ev.sender);
    return;
  }

  let msg: string = '§¶';
  if (ev.sender.hasTag(config.adminPerm))
    msg += '§7[§cadmin§7]§r ';
  msg += '§7' + ev.sender.name + "§r: ";

  // the actual message, masked profanity, removed format codes
  msg += removeFormatCodes(clean(ev.message));

  // [pos] placeholder
  msg = msg.replace(/\[pos\]/g, "§bWorld:§r" +
    " " + ev.sender.dimension.id.replace("minecraft:", "") +
    " §eX:§r" + Math.floor(ev.sender.location.x) +
    " §eY:§r" + Math.floor(ev.sender.location.y) +
    " §eZ:§r" + Math.floor(ev.sender.location.z));

  // [\ command ] placeholder
  msg = msg.replace(new RegExp(`\\[\\${config.commandPrefix}([^\\]]+)\\]`, "g"),
    (_, cmd) => "§b[§e" + config.commandPrefix + cmd + "§b]§r");

  // broadcast the message through [/tellraw]
  message(msg);
});

/**
 * convert profanity word into regex
 * @param prof the word
 * @returns RegExp
 */
export function toRegex(prof: string): RegExp {
  let regex = prof;

  // mask variations for every letters
  regex = regex.replace(/./g, m => { switch(m.toLowerCase()) {
    case "a": return "[*aA@4]";
    case "b": return "[*bB8]";
    case "c": return "[*cC()<>{}\\[\\]]";
    case "d": return "[*dD]";
    case "e": return "[*eE3]";
    case "f": return "[*fF#]";
    case "g": return "[*gG9]";
    case "h": return "[*hH#]";
    case "i": return "[*iI!1]";
    case "j": return "[*jJ]";
    case "k": return "[*kK]";
    case "l": return "[*lL1|]";
    case "m": return "[*mM]";
    case "n": return "[*nN]";
    case "o": return "[*oO0]";
    case "p": return "[*pPq]";
    case "q": return "[*qQp]";
    case "r": return "[*rR]";
    case "s": return "[*sS$5zZ2]";
    case "t": return "[*tT+]";
    case "u": return "[*uUvV]";
    case "v": return "[*vVuU]";
    case "w": return "[*wW]";
    case "x": return "[*xX]";
    case "y": return "[*yY]";
    case "z": return "[*zZ2sS$5]";
    default: return m;
  }});

  // return regexp: ignorecase and global flag
  return new RegExp(regex, "ig");
}

/**
 * filter all the profanity word
 * @param msg the text
 * @returns tbe result
 */
export function clean(msg: string): string {
  let out = msg;

  // replace profanity words
  profanity.forEach(v => out = out.replace(
    toRegex(v), // convert word to regex for better matching
    m => "*".repeat(m.length) // replace with stars
  ));

  return out;
}

