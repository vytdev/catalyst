// types related to custom commands

// parse result
export type parseResult = Record<string, any>;

// type parser function signature
export type commandTypeParser = (argv: commandToken[], def: commandArg) => {
  step?: number,
  value: any,
};

// arg info
export interface commandArg {
  name?: string,
  type: string | commandTypeParser,
  dest: string,
  help?: string,
  required?: boolean,
  default?: any,
  [key: string]: any,
}

// flag info
export interface commandFlag {
  dest: string,
  long?: string,
  short?: string,
  help?: string,
  args?: commandArg[],
}

// command/sub-command info
export interface commandSub {
  name: string,
  dest: string,
  aliases?: string[],
  help?: string,
  args?: commandArg[],
  flags?: commandFlag[],
  subs?: commandSub[],
}

// command token
export interface commandToken {
  text: string,
  start: number,
  end: number,
  quoted: boolean,
}

