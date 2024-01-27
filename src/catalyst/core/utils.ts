/**
 * utility functions
 */

/**
 * calls a function and ignore exceptions
 */
export function safeCall<A extends any[], R extends any>(fn: (...args: A) => R, ...args: A): R {
	try {
		return fn(...args);
	} catch { /* no-op */ }
}
