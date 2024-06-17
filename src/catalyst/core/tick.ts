/**
 * minecraft tick utilities
 */

import { system } from "@minecraft/server";

interface timeoutType {
  id: number,
  counter: number,
  action: (...args: any) => void,
  args: any,
}

interface intervalType {
  id: number,
  time: number,
  action: (...args: any) => void,
  args: any,
}

const timeOuts:  timeoutType[]  = [];
const intervals: intervalType[] = [];
let idCounter = 0;
let tickCounter = 0;

/**
 * delay execution of a function by given number of ticks
 * @param fn the action
 * @param [ticks] delay in ticks
 * @param [args] arguments to pass on the action
 * @returns {number} unique id for the timeout handle
 */
export function setTickTimeout<A extends any[]>(
  fn: (...args: A) => void,
  ticks: number = 1,
  ...args: A
): number {
  const id = idCounter++;

  timeOuts.push({
    id: id,
    counter: ticks,
    action: fn,
    args: args,
  });

  return id;
}

/**
 * execute a function by given time interval
 * @param fn the action
 * @param [ticks] time interval in ticks
 * @param [args] arguments to pass on the action
 * @returns {number} unique id for the interval handle
 */
export function setTickInterval<A extends any[]>(
  fn: (...args: A) => void,
  ticks: number = 1,
  ...args: A
): number {
  const id = idCounter++;

  intervals.push({
    id: id,
    time: ticks,
    action: fn,
    args: args
  });

  return id;
}

/**
 * clear a timeout or interval handle
 * @param id the handle to delete
 * @returns {boolean} whether the handle was found and removed
 */
export function clearTickHandle(id: number): boolean {
  let idx = -1;

  // check timeout handle
  idx = timeOuts.findIndex(v => v.id == id);
  if (idx != -1) {
    timeOuts.splice(idx, 1);
    return true;
  }

  // check interval handle
  idx = intervals.findIndex(v => v.id == id);
  if (idx != -1) {
    intervals.splice(idx, 1);
    return true;
  }

  // handle not found
  return false;
}

/**
 * sleep for your asynchronous functions, in tick scale
 * @param [ticks] the tick delay
 * @returns Promise which should be resolved after certain ticks
 */
export function sleep(ticks: number = 0): Promise<void> {
  return new Promise<void>(resolve => setTickTimeout(resolve, ticks));
}

// loop...
system.runInterval(() => {
  tickCounter++;

  // tick timeouts
  for (const handle of [...timeOuts]) {
    // if counter drops to zero, execute the timeout
    if (--handle.counter != 0)
      continue;

    try {
      handle.action?.apply({}, handle.args || []);
    } catch (e) {
      console.error(e);
    }

    // remove the handle from the list
    clearTickHandle(handle.id);
  }

  // tick interval
  for (const handle of [...intervals]) {
    if (tickCounter % handle.time != 0)
      continue;

    try {
      handle.action?.apply({}, handle.args || []);
    } catch (e) {
      console.error(e);
    }
  }

});

