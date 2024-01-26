/**
 * event mechanism of the api
 */

/**
 * event listener interface
 */
export interface eventListener {
	/**
	 * name of event
	 */
	event: string,
	/**
	 * the callback to execute
	 */
	callback: (...args: any) => void,
	/**
	 * listen for event once
	 */
	once: boolean,
}

/**
 * @class EventManager
 * event manager class
 */
export class EventManager<T extends Record<string, any[]>> {
	/**
	 * event listeners
	 * @private
	 */
	private readonly _listeners: eventListener[] = [];

	/**
	 * registers an event listener
	 * @param event the name of event to listen for
	 * @param callback a function to call when the event is fired
	 * @param [once] listen for the event only once
	 * @param [prepend] make the listener in first priority to execute
	 * @returns the event listener object
	 */
	public addEventListener<N extends keyof T>(
		event: N,
		callback: (...args: T[N]) => void,
		once?: boolean,
		prepend?: boolean
	): eventListener {
		const listener = {
			event: event as string,
			callback,
			once: !!once
		};
		this._listeners.push(listener);
		return listener;
	}

	/**
	 * removes an event listener
	 * @param listener the listener to remove
	 * @returns true if succeded
	 */
	public removeEventListener(listener: eventListener): boolean {
		const idx = this._listeners.indexOf(listener);
		if (idx == -1) return false;
		this._listeners.splice(idx, 1);
		return true;
	}

	/**
	 * fires an event
	 * @param event the name of event
	 * @param args[] the arguments to fire
	 * @returns number of listeners that is fired
	 */
	public dispatchEvent<N extends keyof T>(event: N, ...args: T[N]): number {
		// number of listeners ran
		let n = 0;

		// iterate through the _listeners array
		this._listeners.forEach(listener => {
			// skip listener
			if (listener.event != event) return;
			// increment the counter
			n++;

			// run the listener
			try {
				listener.callback?.(...args);
			} catch (e) {
				// error
				console.error(
					`Uncaught exception on an event listener for ${event as string}:\n`,
					e?.stack || e
				);
			}

			// the listener only listens once
			if (listener.once) this.removeEventListener(listener);
		});

		return n;
	}

	// some aliases for our methods:

	public on<N extends keyof T>(event: N, callback: (...args: T[N]) => void): eventListener {
		return this.addEventListener(event, callback, false, false);
	}

	public once<N extends keyof T>(event: N, callback: (...args: T[N]) => void): eventListener {
		return this.addEventListener(event, callback, true, false);
	}

	public prepend<N extends keyof T>(event: N, callback: (...args: T[N]) => void): eventListener {
		return this.addEventListener(event, callback, false, true);
	}

	public prependOnce<N extends keyof T>(event: N, callback: (...args: T[N]) => void): eventListener {
		return this.addEventListener(event, callback, true, true);
	}

	public off(listener: eventListener): boolean {
		return this.removeEventListener(listener);
	}

	public emit<N extends keyof T>(event: N, ...args: T[N]): number {
		return this.dispatchEvent(event, ...args);
	}
}
