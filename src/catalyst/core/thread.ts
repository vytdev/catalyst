/**
 * multi-threading support, through in-game ticks and generators
 */

import { system } from "@minecraft/server";
import config from "../config.js";
import type { genFn } from "./types.d.ts";

// id counter
let id: number = 0;
// array of active threads
const activeThreads: Thread<any, any>[] = [];

// run the threads
system.runInterval(() => {
	let buffer = config.threadBuffer;

	while (activeThreads.length && buffer-- > 0) {
		const thread = activeThreads.shift();

		try {
			// run task until next breakpoint
			const next = thread._task.next();

			// thread task completed
			if (next.done) {
				thread._fnReturn(next.value);
				// reset thread
				thread._task = null;
				thread._fnReturn = null;
				thread._fnThrow = null;
				continue;
			}

			// queue the thread back
			activeThreads.push(thread);
		}
		catch (e) {
			// exception encountered
			thread._fnThrow(e);
			// reset thread
			thread._task = null;
			thread._fnReturn = null;
			thread._fnThrow = null;
		}
	}
});

/**
 * thread handler
 * @template A args of the generator function
 * @template R return type of the generator function
 */
export class Thread<A extends any[], R extends any> {
	/**
	 * initialize a new Thread instance
	 * @param fn the generator function
	 */
	constructor(fn: genFn<A, R, Thread<any, any>, unknown, unknown>) {
		this._function = fn;
		this.threadId = id++;
	}

	/**
	 * the generator function
	 * @private
	 */
	private readonly _function: genFn<A, R, this, unknown, unknown>;

	/**
	 * the thread id
	 */
	public readonly threadId: number = 0;

	/**
	 * @internal
	 */
	_task: Generator<unknown, R, unknown> = null;
	_fnReturn: Function;
	_fnThrow: Function;

	/**
	 * whether the thread is running, or the thread is on the execution pool
	 */
	public get isRunning(): boolean {
		return activeThreads.includes(this);
	}
	/**
	 * whether the thread is active, or the thread task is still active
	 */
	public get isActive(): boolean {
		return !!this._task;
	}

	/**
	 * start the thread task
	 * @param args[] arguments to pass to the generator
	 * @returns Promise resolved once the task is done, or void if the thread
	 * is already active
	 * @throws this can throw errors when used
	 */
	public start(...args: A): Promise<R> | null {
		// the thread is already running
		if (this.isRunning) return;
		// put this thread into execution pool
		activeThreads.push(this);

		// the thread isn't active yet
		if (!this.isActive) {
			this._task = this._function.apply(this, args);

			// return Promise
			return new Promise<R>((res, rej) => {
				this._fnReturn = res;
				this._fnThrow = rej;
			});
		}
	}

	/**
	 * pause the thread task 
	 * @returns true if the thread has been running, false otherwise
	 */
	public pause(): boolean {
		// task not active
		if (!this.isActive) return false;
		// already paused
		if (!this.isRunning) return false;

		// pause the thread
		activeThreads.splice(activeThreads.indexOf(this), 1);
		return true;
	}

	/**
	 * continue the thread task
	 * @returns true if the thread has been active but is not running, false
	 * otherwise
	 */
	public resume(): boolean {
		// task not active
		if (!this.isActive) return false;
		// thread is already running
		if (this.isRunning) return false;

		// continue the execution
		activeThreads.push(this);
		return true;
	}

	/**
	 * stop the thread task
	 * @param ret return value for the generator
	 * @returns true if the thread has been active
	 */
	public stop(ret: R): boolean {
		// thread is not running
		if (!this.isActive) return false;

		// end the task
		this._fnReturn(ret);
		this._task.return(ret);

		// remove from the execution pool
		if (this.isRunning) activeThreads.splice(activeThreads.indexOf(this), 1);

		// reset Promise functions
		this._fnReturn = null;
		this._fnThrow = null;

		// return
		return true;
	}

	/**
	 * stops and finishes the thread
	 */
	public join(): void {
		// thread is not active, return
		if (!this.isActive) return;
		// the thread is still on execution pool
		if (this.isRunning) this.pause();

		try {
			let result: IteratorResult<unknown>;
			// run the task until end
			while (!(result = this._task.next()).done) continue;
			// return value
			this._fnReturn(result.value);
		}
		catch (e) {
			// exception encountered
			this._fnThrow(e);
		}

		// reset thread
		this._task = null;
		this._fnReturn = null;
		this._fnThrow = null;
	}

	/**
	 * string representation of thread
	 * @returns the string
	 */
	toString(): string {
		return `<thread #${this.threadId}>`;
	}

}
