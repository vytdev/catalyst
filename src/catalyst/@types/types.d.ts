/**
 * dictionary type (same as Record<string, T>)
 */
export type Dictionary<T> = {
	[key: string]: T,
};

/**
 * generator function signature
 * @template A function startup arguments
 * @template R return type
 * @template T this type
 * @template Y yield type
 * @template N .next() type
 */
export type genFn<
	A extends any[],
	R = any,
	T = unknown,
	Y = unknown,
	N = unknown
> = (this: T, ...args: A) => Generator<Y, R, N>;
