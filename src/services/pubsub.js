import redis from 'redis';

let pubClient;
let subClient;

export const init = async () => {
	pubClient = await redis
		.createClient({
			url: process.env.REDIS_URL,
		})
		.on('error', (err) => console.error('Redis Publisher Error', err))
		.connect();

	subClient = await redis
		.createClient({
			url: process.env.REDIS_URL,
		})
		.on('error', (err) => console.error('Redis Subscriber Error', err))
		.connect();
};

const checkRedisConnection = async () => {
	try {
		// check if pubClient is open
		// check if subClient is open
	} catch (error) {
		console.error('Unable to connect to Redis:', error);
		throw error;
	}
};

export const subscribe = async (userId, sessionId) => {
	// add guard clause to check if connected
};

export const unsubscribe = async (userId, sessionId) => {
	// add guard clause to check if connected
};

export const publish = async (sessionId, message) => {
	// add guard clause to check if connected
};

export const disconnect = async () => {
	console.log('Disconnecting from Redis clients.');
};
