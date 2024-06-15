/**
 * custom commands parser
 */

import {
  parseResult,
  commandTypeParser,
  commandArg,
  commandFlag,
  commandSub,
  commandToken,
} from "../@types/commands";
import { CommandError } from "./command.js";

const typeParsers: Record<string, commandTypeParser> = {};

/**
 * register a command type parser
 * @param type name of the type parser
 * @param parser the parser function
 */
export function registerCommandTypeParser(type: string, parser: commandTypeParser) {
  typeParsers[type] = parser;
}

/**
 * parse command args based on given parsing rules
 * @param info the command parsing rules
 * @param argv argument vector to parse
 * @returns {parseResult} the result
 * @throws this can throw errors
 */
export function parseCommand(info: commandSub, cmd: string, argv: commandToken[]): parseResult {
  const result: parseResult = {};
  let useFlags = true;

  // internal function to process an argument
  function processArg(idx: number, argDef: commandArg, result: parseResult): number {
    const typeParser = typeof argDef.type == 'string'
      ? typeParsers[argDef.type]
      : argDef.type;

    if (typeof typeParser != 'function') {
      const err = new CommandError('internal error: type parser of argument is not callable');
      err.token = argv[idx];
      err.command = cmd;
      throw err;
    }

    // try to parse arg
    try {
      const parsed = typeParser(argv.slice(idx), argDef);
      result[argDef.dest] = parsed.value;
      return idx + (parsed.step || 1);
    }
    catch (e) {
      if (!(e instanceof CommandError)) {
        const err = new CommandError(
          'internal error: exception encountered with trace stack:\n' + e.stack
        );
        err.command = cmd;
        throw err;
      }
      e.command = cmd;
      throw e;
    }
  }

  // internal function to process a command or sub-command
  function processCmd(idx: number, cmdDef: commandSub, result: parseResult): number {
    let argIdx = 0;

    for ( ; idx < argv.length; idx++) {
      const arg = argv[idx];

      if (useFlags && !arg.quoted && arg.text[0] == '-') {
        let isShort = arg.text[1] != '-';

        if (!isShort && arg.text.length == 2) {
          useFlags = false;
          continue;
        }

        const chars = arg.text.slice(!isShort ? 2 : 1);
        const flagName = chars.split('=')[0];
        const equalArg = chars.slice(flagName.length + 1);
        // try finding a long flag
        const longFlag = cmdDef.flags?.find(v => v.long == flagName);

        // this starts with 2 dash, but the flag def not found
        if (!isShort && !longFlag) {
          const err = new CommandError('unrecognized option: --' + flagName,
                                       2,
                                      flagName != chars ? equalArg.length + 1 : 0);
          err.token = arg;
          err.command = cmd;
          throw err;
        }

        // -long-flag-name
        if (longFlag) isShort = false;

        // current flag def to process
        let currentFlag = longFlag;

        // procesa short flags
        if (isShort) {
          let flagIdx = 0;
          for (const f of chars) {

            // -abc=argForC
            if (currentFlag?.args?.length && f == '=')
              break;

            // next flag
            flagIdx++;
            currentFlag = cmdDef.flags?.find(v => v.short?.[0] == f);

            // unknown flag
            if (!currentFlag) {
              const err = new CommandError('unknown flag: -' + f,
                                           flagIdx,
                                           arg.text.length - flagIdx - 1);
              err.token = arg;
              err.command = cmd;
              throw err;
            }

            // set the flag
            result[currentFlag.dest] = true;
          }
        }

        // possible equals found
        if (chars != flagName) {
          // whether the flag is like this: --flagName="arg"
          const useNextArg = !equalArg.length;

          // option does not have arg defs
          if (!currentFlag.args?.length && longFlag) {
            const err = new CommandError('option does not need any argument: ' + flagName,
                                         flagName.length + 3);
            err.token = arg;
            err.command = cmd;
            // arg on next token
            if (useNextArg) {
              err.token = argv[idx + 1];
              err.start = 0;
            }
            throw err;
          }

          // remove the equalArg in the current flag
          arg.end -= equalArg.length + 2;

          // the arg is in current flag token
          if (!useNextArg)
            argv.splice(idx + 1, 0, {
              start: arg.start + flagName.length + 2,
              end: arg.end + chars.length,
              text: equalArg,
              quoted: false,
            });
        }

        // current flag has arguments
        if (currentFlag.args?.length) {
          let flagArgIdx = 0;
          let processFlagArgs = true;
          let err;

          for ( ; flagArgIdx < currentFlag.args.length; flagArgIdx++) {
            const argDef = currentFlag.args[flagArgIdx];

            if (processFlagArgs)
              try {
                idx = processArg(idx + 1, argDef, result) - 1;
                continue;
              }
              catch (e) {
                err = e;
                processFlagArgs = false;

                // needs more args
                if (argv.length <= idx + 1) {
                  err = new CommandError('option requires more arguments');
                  err.token = {
                    text: "",
                    start: cmd.length,
                    end: cmd.length,
                    quoted: false,
                  };
                  err.command = cmd;
                }
              }

            // arg is required, or equal arg is found
            if (argDef.required || (flagArgIdx == 0 && chars != flagName))
              throw err;

            // default args
            result[argDef.dest] = argDef.default;
          }
        }

        // for long flags
        result[currentFlag.dest] = true;

        continue;
      }

      // process args
      const argDef = cmdDef.args?.[argIdx++];

      // no arg left
      if (!argDef) {
        // no sub commands
        if (!cmdDef.subs?.length) {
          const err = new CommandError('too many arguments', 0, -cmd.length);
          err.token = arg;
          err.command = cmd;
          throw err;
        }

        // process sub-commands
        const unNamedSubs: commandSub[] = [];
        let done = false;

        for (const subDef of cmdDef.subs) {
          if (!subDef.name?.length) {
            unNamedSubs.push(subDef);
            continue;
          }

          // sub-command found with that name or alias
          if (subDef.name == arg.text || subDef.aliases?.includes(arg.text)) {
            idx = processCmd(idx + 1, subDef, result);
            done = true;
            break;
          }
        }

        // sub-command done
        if (done) break;

        // no sub-command was found with that name
        if (!unNamedSubs.length) {
          const err = new CommandError('unknown sub-command: ' + arg.text);
          err.token = arg;
          err.command = cmd;
          throw err;
        }

        let err;

        for (const subDef of unNamedSubs) {
          const subResult: parseResult = {};

          try {
            idx = processCmd(idx, subDef, subResult);
          } catch (e) {
            if (!err) err = e;
            continue;
          }

          // sub-command succeded
          done = true;
          for (const k in subResult) result[k] = subResult[k];
          break;
        }

        // unnamed sub not found
        if (!done) throw err;

        break;
      }

      // parse argument
      idx = processArg(idx, argDef, result) - 1;
    }

    // left not processed args
    if (cmdDef.args) {
      for ( ; argIdx < cmdDef.args.length; argIdx++) {
        const argDef = cmdDef.args[argIdx];

        // required argument!
        if (argDef.required) {
          const err = new CommandError('unexpected end of input');
          err.token = {
            text: "",
            start: cmd.length,
            end: cmd.length,
            quoted: false,
          };
          err.command = cmd;
          throw err;
        }

        // set their defaulrs
        result[argDef.dest] = argDef.default;
      }
    }

    // command/sub-command processed successfully
    result[cmdDef.dest] = true;

    return idx;
  }

  // process command
  processCmd(1, info, result);

  return result;
}

// built-in type parsers
registerCommandTypeParser('string', (argv, argDef) => ({ value: argv[0]?.text }));

