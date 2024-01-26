/**
 * contains all default settings of the catalyst core
 */
export default {
	/**
	 * enable debugging
	 */
	debug: true,
	/**
	 * threshold duration for server lag warning (in milliseconds)
	 */
	serverLagWarning: 400,
	/**
	 * how many minecraft commands from the queue should be executed in a tick
	 */
	commandBuffer: 128,

	/**
	 * command prefix to use, default is "\"
	 */
	commandPrefix: "\\",

	/**
	 * allow multithreading
	 */
	multiThreading: true,
	/**
	 * max number of thread tasks to execute every tick
	 */
	threadBuffer: 512,

	// other configs here

	/**
	 * permission id needed for a player to have administration control
	 */
	adminPerm: 'admin',
} as const;
