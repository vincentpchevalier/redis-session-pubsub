import redis from 'redis';

let pubClient;
let subClient;

const init = async () => {
	console.log('Connecting to Redis...');
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

// "private"
const checkRedisConnection = async () => {
	try {
		// check if pubClient is open
		if (!pubClient.isOpen) {
			console.log('Connecting pub client to Redis...');
			await pubClient.connect();
		}

		// check if subClient is open
		if (!subClient.isOpen) {
			console.log('Connecting sub client to Redis...');
			await subClient.connect();
		}
	} catch (error) {
		console.error('Unable to connect to Redis:', error);
		throw error;
	}
};

export const subscribe = async (userId, sessionId) => {
	checkRedisConnection();
};

export const unsubscribe = async (userId, sessionId) => {
	checkRedisConnection();
};

export const publish = async (sessionId, message) => {
	checkRedisConnection();
};

export const disconnect = async () => {
	console.log('Disconnecting from Redis clients.');
};

export default init;
