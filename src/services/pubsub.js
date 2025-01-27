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
	console.log('Checking Redis connection...');
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
	await checkRedisConnection();

	await subClient.subscribe(sessionId, (message) => {
		console.log(`User ${userId} received message: ${message} `);
	});
};

export const unsubscribe = async (sessionId) => {
	try {
		console.log(`Unsubscribing from session ${sessionId}`);
		await checkRedisConnection();

		await subClient.unsubscribe(sessionId);
	} catch (error) {
		console.error(error);
	}
};

export const publish = async (sessionId, message) => {
	await checkRedisConnection();

	await pubClient.publish(sessionId, JSON.stringify(message));
};

// Disconnects from Redis clients; use unsubscribe instead for now.
export const disconnect = async () => {
	console.log('Disconnecting from Redis clients.');
	// check if pubClient is open
	if (pubClient.isOpen) {
		await pubClient.quit();
	}

	// check if subClient is open
	if (subClient.isOpen) {
		await subClient.quit();
	}

	console.log('Disconnected from Redis.');
};

export default init;
