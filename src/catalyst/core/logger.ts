/**
 * a simple logger
 */

// our placeholder
const logTextPlaceholder = "[text]";
const logTypePlaceholder = "[type]";

/**
 * @class Logger
 * a custom logger
 */
export class Logger {
	/**
	 * @constructor
	 * make an instance of logger
	 * @param format the log format, with placeholders "[text]" and "[type]"
	 * @throws placeholder [text] not found on format string
	 */
	constructor(format: string = "[[type]] [text]") {
		if (format.indexOf(logTextPlaceholder) == -1)
			throw new Error("Placeholder \"[text]\" not found on log format: " + format);
		this.format = format;
	}

	/**
	 * the log format
	 */
	public readonly format: string;

	/**
	 * whether to show all logs on the gui (useful when debugging)
	 */
	public showToGui: boolean = false;
	/**
	 * enable debug logging
	 */
	public showDebug: boolean = false;

	/**
	 * return a text from the given log following the format string
	 * @param text the text
	 * @param type the log type
	 * @return result
	 */
	public makeLogText(text: string, type: string): string {
		return this.format.replace(logTypePlaceholder, type).replace(logTextPlaceholder, text);
	}

	/**
	 * prints the log into the content log file or gui, or botha
	 * @param text the log text
	 * @param prior how log is shown:
	 * - 0     only on the content log file
	 * - 1     both the log file and gui (uses console.warn)
	 * - 2     for fatal errors (uses console.error)
	 */
	public printLog(text: string, prior: 0 | 1 | 2): void {
		switch (prior) {
			case 0: console.log(text); break;
			case 1: console.warn(text); break;
			case 2: console.error(text); break;
		}
	}

	/**
	 * logs a message
	 * @param msg the text
	 */
	public log(text: string): void {
		this.printLog(this.makeLogText(text, "log"), this.showToGui ? 1 : 0);
	}

	/**
	 * logs information
	 * @param msg the text
	 */
	public info(text: string): void {
		this.printLog(this.makeLogText(text, "info"), this.showToGui ? 1 : 0);
	}

	/**
	 * logs debugging message
	 * @param msg the text
	 */
	public debug(text: string): void {
		if (!this.showDebug) return;
		this.printLog(this.makeLogText(text, "debug"), this.showToGui ? 1 : 0);
	}

	/**
	 * logs a warning
	 * @param msg the text
	 */
	public warn(text: string): void {
		this.printLog(this.makeLogText(text, "warning"), 1);
	}

	/**
	 * logs an error
	 * @param msg the text
	 */
	public error(text: string): void {
		this.printLog(this.makeLogText(text, "error"), 2);
	}

}
