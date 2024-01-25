/**
 * contains all default settings of the catalyst core
 */
export default {
	/**
	 * enable debugging
	 */
	debug: true,
	/**
	 * command prefix to use, default is "\"
	 */
	commandPrefix: "\\",
	/**
	 * threshold duration for server lag warning (in milliseconds)
	 */
	serverLagWarning: 400,
	/**
	 * how many commands from the queue should be executed in a tick
	 */
	commandBuffer: 128,
	/**
	 * max number of thread tasks to execute every tick
	 */
	threadBuffer: 512,
} as const;
